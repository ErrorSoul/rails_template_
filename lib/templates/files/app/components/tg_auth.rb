# frozen_string_literal: true

require "openssl"
require "uri"
require "json"

# Verifies Telegram WebApp initData per
# https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
#
# Algorithm:
#   1. URL-decode initData into key=value pairs.
#   2. Take all pairs except `hash`, sort by key, join as "k=v\n..." → data_check_string.
#   3. secret_key   = HMAC_SHA256(key="WebAppData", msg=bot_token)
#   4. expected_hex = HMAC_SHA256_HEX(key=secret_key, msg=data_check_string)
#   5. Constant-time compare expected_hex with received hash.
#   6. Reject if auth_date is older than AUTH_TTL.
class TgAuth
  AUTH_TTL = 24 * 60 * 60 # seconds

  Result = Struct.new(:ok, :user, :error, keyword_init: true) do
    def ok?; ok; end
  end

  def self.verify(init_data, bot_token: ENV.fetch("TG_BOT_TOKEN"))
    new(init_data, bot_token).verify
  end

  def initialize(init_data, bot_token)
    @init_data = init_data.to_s
    @bot_token = bot_token.to_s
  end

  def verify
    return failure("empty initData") if @init_data.empty?
    return failure("missing TG_BOT_TOKEN") if @bot_token.empty?

    pairs = URI.decode_www_form(@init_data).to_h
    received = pairs.delete("hash")
    return failure("missing hash") unless received

    auth_date = pairs["auth_date"]&.to_i
    return failure("missing auth_date") unless auth_date && auth_date.positive?
    return failure("stale auth_date")   if Time.now.to_i - auth_date > AUTH_TTL

    data_check_string = pairs.sort.map { |k, v| "#{k}=#{v}" }.join("\n")
    secret_key   = OpenSSL::HMAC.digest("SHA256", "WebAppData", @bot_token)
    expected_hex = OpenSSL::HMAC.hexdigest("SHA256", secret_key, data_check_string)

    return failure("bad hash") unless ActiveSupport::SecurityUtils.secure_compare(expected_hex, received)

    user = pairs["user"] ? JSON.parse(pairs["user"]) : {}
    Result.new(ok: true, user: user)
  rescue JSON::ParserError, ArgumentError, KeyError => e
    failure("parse error: #{e.message}")
  end

  private

  def failure(msg)
    Result.new(ok: false, error: msg)
  end
end
