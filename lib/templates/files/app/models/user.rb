# frozen_string_literal: true

# TG Mini App user — identified by telegram_id, no password.
# Created/updated on every successful initData verification.
class User < ApplicationRecord
  validates :telegram_id, presence: true, uniqueness: true

  def display_name
    [first_name, last_name].compact_blank.join(' ').presence || username || "tg##{telegram_id}"
  end
end
