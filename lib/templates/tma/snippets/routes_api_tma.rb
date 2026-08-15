      namespace :tma do
        resource :auth, only: %i[create show destroy]
        # tma_resource generator inserts TMA api routes here. Marker:
        # <!-- TMA_RESOURCE_TMA_API_ROUTES -->
      end
