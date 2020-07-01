Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :registration, only: [:create]
      get  'auth_auth' => 'auth#auth'
      delete 'auth_s'  => 'auth#destroy_admin'
      post 'login_norm' => 'auth#login'
      post 'password/forgot', to: 'passwords#forgot'
      post 'password/reset', to: 'passwords#reset'
      get  'password/check', to: 'passwords#check'
      resources :auth, only: [:index, :destroy]

      namespace :main do

      end

      namespace :admin do

      end

    end
  end



  #get '/admin', to: 'admin#index'
  scope :admin do
    get '*page', to: 'admin#index', constraints: ->(req) do
      !req.xhr? && req.format.html?
    end
  end

  get '*page', to: 'static#index', constraints: ->(req) do
    !req.xhr? && req.format.html?
  end

  root 'static#index'
end
