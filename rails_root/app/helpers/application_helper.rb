module ApplicationHelper

  def has_error(model, attr)
    "has-warning" if model.errors[attr].present?
  end

  def hint_errors(messages, attr)
    messages[attr].map do |message|
      content_tag(:div, message, class: 'form-control-feedback')
    end.join.html_safe
  end

  def current_country
    current_user.role == 'operator' ? [current_user.country] : Country.all
  end
end
