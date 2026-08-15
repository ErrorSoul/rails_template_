# frozen_string_literal: true

# CORS — needed if your TMA frontend lives on a different host than the API.
# By default Rails serves the TMA shell from the same origin, so this is a no-op.
# Uncomment + adjust origins if you split frontend/backend.
#
# Rails.application.config.middleware.insert_before 0, Rack::Cors do
#   allow do
#     origins ENV.fetch('CORS_ORIGINS', '').split(',')
#     resource '/api/*', headers: :any, methods: %i[get post put patch delete options], credentials: true
#   end
# end
