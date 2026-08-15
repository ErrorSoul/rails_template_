# frozen_string_literal: true

module Api
  module V1
    class BaseController < ActionController::API
      include ActionController::Cookies
      include Response

      before_action :check_auth

      protected

      def check_auth
        json_response({ error: 'unauthorized' }, :unauthorized) and return unless current_user
      end

      def current_user
        @current_user ||= Authenticator.current_user(cookies)
      end

      def current_superuser
        @current_superuser ||= Authenticator.current_superuser(cookies)
      end
    end
  end
end
