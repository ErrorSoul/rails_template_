# frozen_string_literal: true

require "rails/generators/named_base"

# Usage: bin/rails g tma_resource Item "title body:text price:integer"
#
# Creates: model + migration (via built-in 'model' generator), admin controller,
# admin views (index/show/new/edit/_form), inserts admin route, inserts sidebar entry.
#
# Ported and simplified from ~/works/cookware.me/lib/generators/genya/genya_generator.rb.
# Differences: ERB views (not React), no API controllers (admin only), uses design_system CSS classes.
class TmaResourceGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  argument :attrs_string, type: :string, default: "",
                          desc: 'Attribute list, e.g. "title body:text price:integer". Default type is string.'

  def normalize_attrs
    @attrs = attrs_string.to_s.split(/\s+/).reject(&:empty?).map do |entry|
      n, t = entry.split(":")
      { name: n, type: t || "string" }
    end
  end

  def generate_model
    args = @attrs.map { |a| "#{a[:name]}:#{a[:type]}" }.join(" ")
    generate "model", "#{class_name} #{args}".strip
  end

  def add_validations
    # Booleans are excluded on purpose: `presence: true` rejects `false`, so a boolean
    # column would be impossible to set to false.
    validated = @attrs.reject { |a| a[:type] == "boolean" }
    return if validated.empty?
    lines = validated.map { |a| "  validates :#{a[:name]}, presence: true" }.join("\n") + "\n"
    inject_into_class "app/models/#{singular_name}.rb", class_name, lines
  end

  # Overwrites the stub rspec-rails emits from `generate "model"`, which is `pending`
  # and would leave every freshly generated project with a yellow suite.
  def replace_model_spec
    template "model_spec.rb.erb", "spec/models/#{singular_name}_spec.rb", force: true
  end

  def create_admin_controller
    template "admin_controller.rb.erb", "app/controllers/admin/#{plural_name}_controller.rb"
  end

  def create_admin_views
    %w[index show new edit _form].each do |v|
      template "views/#{v}.html.erb", "app/views/admin/#{plural_name}/#{v}.html.erb"
    end
  end

  def add_admin_route
    inject_into_file "config/routes.rb",
                     "    resources :#{plural_name}\n",
                     before: "    # <!-- TMA_RESOURCE_ADMIN_ROUTES -->"
  end

  def add_sidebar_entry
    inject_into_file "app/helpers/application_helper.rb",
                     %(      { label: "#{class_name.pluralize}", path: "/admin/#{plural_name}", icon: "📦" },\n),
                     after: "      # <!-- TMA_RESOURCE_NAV -->\n"
  end

  private

  def attrs
    @attrs
  end
end
