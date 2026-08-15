# frozen_string_literal: true

module Api
  module V1
    module Tma
      class AuthsController < Api::V1::BaseController
        skip_before_action :check_auth, only: %i[create]

        # POST /api/v1/tma/auth — verify initData, find/create User, issue JWT cookie.
        def create
          init_data = params.require(:init_data)
          result = TgAuth.verify(init_data)
          return json_response({ error: result.error }, :unauthorized) unless result.ok?

          data = result.user
          user = User.find_or_initialize_by(telegram_id: data['id'])
          user.assign_attributes(
            first_name:    data['first_name'],
            last_name:     data['last_name'],
            username:      data['username'],
            language_code: data['language_code'],
            is_premium:    !!data['is_premium'],
            photo_url:     data['photo_url']
          )
          user.save!
          Authenticator.login(cookies, user)
          json_response(serialize(user))
        end

        # GET /api/v1/tma/auth/me
        def show
          json_response(current_user ? serialize(current_user) : nil)
        end

        # DELETE /api/v1/tma/auth
        def destroy
          Authenticator.logout(cookies, role: :user)
          head :no_content
        end

        private

        def serialize(user)
          user.slice(:id, :telegram_id, :first_name, :last_name, :username, :language_code, :is_premium, :photo_url)
        end
      end
    end
  end
end
