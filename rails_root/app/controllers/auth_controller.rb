class Api::V1::AuthController < Api::V1::BaseController
  skip_before_action :verify_authenticity_token
  before_action :check_auth, only: [:index, :destroy]
  before_action :check_auth_admin, only: [:auth]

  def index
    return json_response({
      isAuth: true,
      user: {id: current_user.id, email: current_user.email, phone: current_user.phone}
    })
  end

  def auth
    return json_response({
      isAuth: true,
      login: superuser.login
    })
  end

  def login
    @next_path = params[:next].present? ? params[:next] : root_path
    if request.get?
      @login = ""
    else
      @login = params[:suser][:login].to_s.downcase.strip
      password = params[:suser][:password].to_s
      user = Superuser.find_by(login: @login)
      if user&.authenticate(password)
        Authenticator.login(cookies, user)
        return json_response({
          isAuth: true,
          user: user.login
        })
      else
        return json_response({ errors: { password: "Неправильная пара почта/пароль"}}, :unprocessable_entity)
      end
    end

  end

  def destroy
    current_user
    Authenticator.logout(cookies)
    return json_response({message: :logout})
  end

  def destroy_admin
    Authenticator.admin_logout(cookies)
    return json_response({message: :logout})
  end


end
