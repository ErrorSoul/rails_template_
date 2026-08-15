# frozen_string_literal: true

module Api
  module V1
    module Admin
      class BaseController < Api::V1::BaseController
        skip_before_action :check_auth
        before_action :check_auth_admin

        protected

        def check_auth_admin
          json_response({ error: 'unauthorized' }, :unauthorized) and return unless current_superuser
        end
      end
    end
  end
end
