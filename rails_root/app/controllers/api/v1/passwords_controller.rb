class Api::V1::PasswordsController < Api::V1::BaseController
  def forgot
    if params[:email].blank?
      return json_response({errors: {email:  t('errors.email_not_present')} }, :unprocessable_entity)
    end

    user = User.find_by(email: params[:email].downcase)

    if user
      user.generate_password_token!
      SendPasswordResetUserJob.perform_later(user.id)
      return json_response({message: 'ok'})
    else
      return json_response({errors: {email: t('errors.email_not_found')} }, :not_found)
    end

  end


  def check
    token = params[:reset_token].to_s
    user = User.find_by(reset_password_token: token)

    if user.present?
      if  user.password_token_valid?
        return json_response({message: :ok})
      else
        return json_response({errors: {token: t('errors.reset_token_expired') }}, :not_found)
      end
    else
      return json_response({errors: {token: t('errors.reset_token_not_found')}}, :unprocessable_entity)
    end
  end


  def reset
    token = params[:reset_token].to_s

    if params[:password].blank?
      return json_response({errors: {password: t('errors.password_not_found')}}, :unprocessable_entity)
    end

    user = User.find_by(reset_password_token: token)

    if user.present?
      if user.password_token_valid?
        user.reset_password!(params[:password])
        return json_response({message: :ok})
      else
        return json_response({errors: {token: t('errors.reset_token_expired') }}, :not_found)
      end
    else
      return json_response({errors: {token: t('errors.reset_token_not_found')}}, :unprocessable_entity)
    end
  end

end
