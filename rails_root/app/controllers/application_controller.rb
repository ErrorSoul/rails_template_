class ApplicationController < ActionController::Base
  before_action :set_raven_context
  helper_method :current_user, :superuser

  rescue_from ActiveRecord::RecordNotFound, with: lambda{|e| request.format.json? ? record_not_found(e) : raise(e) }

  def current_user
    @current_user ||= Authenticator.current_user(cookies)
  end

  def superuser
    @superuser ||= Authenticator.superuser(cookies)
  end

  def record_not_found(error)
    render json: { status: 'not_found', message: error.message }, status: :not_found
  end

  private

  def set_raven_context
    Raven.user_context(id: (current_user || superuser)&.id) # or anything else in session
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end

end
