class Api::V1::RegistrationController < Api::V1::BaseController
  protect_from_forgery prepend: true, with: :exception
  skip_before_action :verify_authenticity_token
  rescue_from ActiveRecord::RecordNotFound, with: :user_not_found


  def create
    registration_form = ApiForm::RegistrationForm.new(user_params)
    if registration_form.create
      if TwilioClient.delay(priority: -10).call(registration_form.user.code_to_sms, (user_phone=registration_form.user.phone))
        cookies.signed[:userID] = { value: user_phone, expires: 15.minutes.from_now }
        cookies[:user_phone] = { value: Base64.encode64(user_phone), expires: 14.hour.from_now }
        return json_response({ message: :sending })
      else
        return json_response({ errors: :sending_error }, :unprocessable_entity)
      end
      return json_response({ user: registration_form.user.id })
    else
      return json_response({ errors: registration_form.errors.messages }, :unprocessable_entity)
    end

  end


  def email
    registration_form = ApiForm::RegistrationEmailForm.new(login_params)
    if registration_form.create
      user = registration_form.user
      Authenticator.login(cookies, user)
      user.invite
      return json_response({user: user})
    else
      return json_response({ errors: registration_form.errors.messages }, :unprocessable_entity)
    end

  end

  def login_email
    @user = User.find_by("trim(lower(email)) = ?", params[:user][:email].strip)

    if @user&.authenticate(params[:user][:password].strip)
      Authenticator.login(cookies, @user)
      return json_response({ phone: @user.phone, user: {id: @user.id, email: @user.email} })
    else
      return json_response({ errors: {email: "Неправильная пара почта/пароль"} }, :unprocessable_entity)
    end
  end

  def login_phone
    @user = User.find_by(phone: params[:user][:phone])
    if @user
      @user.new_code
      cookies.signed[:userID] = { value: @user.phone, expires: 1.hour.from_now }
      TwilioClient.delay(priority: -10).call(@user.code_to_sms, @user.phone)
       return json_response({ phone: @user.phone, user: {id: @user.id, email: @user.email} })
    else
      return json_response({ errors: {phone: "Телефон не найден"} }, :unprocessable_entity)
    end
  end

  def checking_code
    #@user = User.find_by(phone: ('+' + cookies['userID'].slice(1..-1)))
    @user = User.find_by(phone: cookies.signed['userID'])
    if @user && @user.code == params[:code]
      @user.code = nil
      @user.save
      @user.activate
      Authenticator.login(cookies, @user)
      cookies[:user_phone] = { value:  Base64.encode64(@user.phone), expires: 24.hour.from_now }
      return json_response({ message: :ok, user: @user.to_json(only: [:phone, :email]) })
    elsif @user
      return json_response({ errors: {code: "Неправильный код подтверждения"} }, :unprocessable_entity)
    else
      return phone_not_found
    end
  end

  def get_new_code
    @user = User.find_by(phone: cookies.signed['userID'])
    if @user
      @user.new_code
      if TwilioClient.delay(priority: -10).call(@user.code_to_sms, @user.phone)
        return json_response({ message: :sending, user: @user.to_json(only: [:phone, :email]) })
      else
        return json_response({ errors: {code: "Отправка сообщений временно не доступна"} }, :unprocessable_entity)
      end
    else
      return phone_not_found
    end
  end

  private

  def user_params
    params.require(:user).permit(:phone, :password)
  end

   def login_params
    params.require(:user).permit(:email, :password)
  end

  def user_not_found
    json_response({errors: {user: :not_found}}, :unprocessable_entity)
  end

   def phone_not_found
     json_response({errors: {code: "Номер не найден"}}, :unprocessable_entity)
  end

end
