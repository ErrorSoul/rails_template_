# frozen_string_literal: true

module ApplicationHelper
  # Returns the admin sidebar items. The tma_resource generator inserts entries
  # right after the marker — the last element must stay comma-free
  # (Style/TrailingCommaInArrayLiteral). Keep this list in sync with config/routes.rb.
  def admin_nav_items
    [
      # <!-- TMA_RESOURCE_NAV -->
      { label: "Superusers", path: "/admin/superusers", icon: "🛡️" }
    ]
  end
end
