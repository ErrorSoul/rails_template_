# frozen_string_literal: true

module ApplicationHelper
  # Returns the admin sidebar items. The tma_resource generator appends entries
  # via inject_into_file. Keep this list in sync with config/routes.rb.
  def admin_nav_items
    [
      { label: 'Superusers', path: '/admin/superusers', icon: '🛡️' },
      # <!-- TMA_RESOURCE_NAV -->
    ]
  end
end
