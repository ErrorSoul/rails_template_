# frozen_string_literal: true

# Cookie+JWT auth, dual-role: Superuser (bcrypt login) and User (however the app
# chooses to sign end users in). Without a User model `current_user` just returns
# nil — `decode` constantizes lazily, so the admin half works on its own.
#
# Ported from ~/works/lave-cashback/app/components/authenticator.rb,
# simplified — no Twilio/SMS, no state machine.
class Authenticator
  USER_COOKIE  = :uid
  ADMIN_COOKIE = :suid
  USER_TTL  = 7.days
  ADMIN_TTL = 7.days

  class << self
    def login(cookies, principal)
      key, ttl = cookie_for(principal)
      token = JsonWebToken.encode({ id: principal.id, type: principal.class.name }, ttl.from_now)
      cookies.signed[key] = {
        value: token, httponly: true, expires: ttl.from_now, same_site: :lax
      }
    end

    def logout(cookies, role: :user)
      cookies.delete(role == :admin ? ADMIN_COOKIE : USER_COOKIE)
    end

    def current_user(cookies)
      decode(cookies.signed[USER_COOKIE], expected: "User")
    end

    def current_superuser(cookies)
      decode(cookies.signed[ADMIN_COOKIE], expected: "Superuser")
    end

    private

    def cookie_for(principal)
      principal.is_a?(Superuser) ? [ ADMIN_COOKIE, ADMIN_TTL ] : [ USER_COOKIE, USER_TTL ]
    end

    def decode(token, expected:)
      return nil unless token
      payload = JsonWebToken.decode(token)
      return nil unless payload && payload["type"] == expected
      expected.safe_constantize&.find_by(id: payload["id"])
    end
  end
end
