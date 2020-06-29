# Отвечает за прописывание пользователя в куке
class Authenticator
  def self.login(cookies, user, remember: nil)
    if user.is_a?(Superuser)
      exp = 1.weeks.from_now
      value = JsonWebToken.encode({value: "#{user.id}"}, exp)
      if remember
        cookies.signed.permanent[:suid] = {
          value: value,
          httponly: true,
        }
      else
        cookies.signed[:suid] = {
          value: value,
          httponly: true,
          expires: exp
        }
      end
    elsif user.is_a?(User)
      exp = 3.days.from_now
      value = JsonWebToken.encode({value: "d-#{user.id}"}, exp)
      if remember
        cookies.signed.permanent[:uid] = {
          value: value,
          httponly: true
        }
      else
        cookies.signed[:uid] = {
          value: value,
          httponly: true,
          expires: exp
        }
      end
    else
      raise "unreacheable"
    end
  end

  def self.logout(cookies)
    cookies.delete :uid
  end

  def self.admin_logout(cookies)
    cookies.delete :suid
    cookies.delete :uid
  end

  def self.current_user(cookies)
    token = cookies.signed[:uid]
    return unless token

    jwt = JsonWebToken.decode(token)
    return unless jwt
    return unless jwt[:value]

    user_type, user_id = jwt[:value].to_s.split('-', 2)

    if user_type == 'd' && (user = User.find_by_id(user_id))
      user
    end
  end

  def self.superuser(cookies)
    token = cookies.signed[:suid]
    return unless token

    jwt = JsonWebToken.decode(token)
    return unless jwt
    return unless (suid = jwt[:value])
    Superuser.find_by(id: suid)
  end

  def self.token(user, expires_in: nil)
    if user.is_a?(Superuser)
      verifier.generate(['su', user.id, user.token], expires_in: expires_in)
    elsif user.is_a?(User)
      verifier.generate(['d', user.id, user.token], expires_in: expires_in)
    else
      raise "unreacheable"
    end
  end

  def self.regenerate_token(user)
    if user.is_a?(Superuser)
      user.regenerate_token
    elsif user.is_a?(User)
      user.regenerate_token
    else
      raise "unreacheable"
    end
    token(user)
  end

  def self.current_user_from_http_token(controller:)
    controller.authenticate_with_http_token do |token, options|
      current_user_from_token(token: token)
    end
  end

  def self.current_user_from_token(token:)
    begin
      user_type, user_id, user_token = verifier.verify(token)
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      return
    end

    if user_type == 'd' && (user = User.find_by(id: user_id, token: user_token))
      user
    end
  end

  def self.superuser_from_http_token(controller:)
    controller.authenticate_with_http_token do |token, options|
      superuser_from_token(token: token)
    end
  end

  def self.superuser_from_token(token:)
    begin
      user_type, user_id, user_token = verifier.verify(token)
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      return
    end

    if user_type == 'su' && (superuser = Superuser.find_by(id: user_id, token: user_token))
      superuser
    end
  end

  private

  def self.verifier
    @@verifier ||= ActiveSupport::MessageVerifier.new(Rails.application.credentials[:secret_key_base], digest: 'SHA256')
  end
end
