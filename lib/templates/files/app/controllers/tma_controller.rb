# frozen_string_literal: true

# Serves the Telegram Mini App HTML shell. Auth is JS-side: the page loads
# telegram-web-app.js, reads window.Telegram.WebApp.initData, and POSTs it to
# /api/v1/tma/auth which sets a signed cookie. From then on, all /api/v1/tma/*
# requests are authenticated via Authenticator.current_user(cookies).
class TmaController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false
  layout 'tma'

  def index; end
end
