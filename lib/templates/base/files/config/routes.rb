Rails.application.routes.draw do
  # Health check (for load balancers, k8s liveness probes, dev sanity)
  get "/up", to: "rails/health#show", as: :rails_health_check

  root to: redirect("/admin")

  # Overlay presets inject their own top-level routes here. Marker:
  # <!-- PRESET_ROUTES -->

  # Admin panel (server-rendered ERB + Stimulus)
  get "/admin/login",     to: "admin#login",        as: :admin_login
  post "/admin/login",    to: "admin#authenticate", as: :admin_authenticate
  delete "/admin/logout", to: "admin#logout",       as: :admin_logout
  get "/admin",           to: "admin#index",        as: :admin_root

  namespace :admin do
    resources :superusers
    # tma_resource generator inserts admin resources here. Marker:
    # <!-- TMA_RESOURCE_ADMIN_ROUTES -->
  end

  # JSON API
  namespace :api do
    namespace :v1 do
      # Overlay presets inject their own API namespaces here. Marker:
      # <!-- PRESET_API_ROUTES -->
      namespace :admin do
        # tma_resource generator inserts admin api routes here. Marker:
        # <!-- TMA_RESOURCE_ADMIN_API_ROUTES -->
      end
    end
  end
end
