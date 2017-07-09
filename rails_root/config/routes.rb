Rails.application.routes.draw do

  root "mains#index"
  namespace :admin do
    resources :dashboards
  end

 end
