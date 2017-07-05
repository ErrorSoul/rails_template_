module LabelStatusHelper
  BADGE_TYPES = {
    new:      "badge_admin badge-info",
    process:  "badge_admin badge-warning",
    pay_ok:   "badge_admin badge-success",
    pay_error: "badge_admin badge-danger",

    free:  "badge badge-info",
    used:  "badge badge-success"
  }.freeze


  USER_TYPES = {
    admin:  "badge badge-warning",
    operator:  "badge badge-primary",
    manager:   "badge badge-success",
  }

  def status_badge(status)
    BADGE_TYPES[status.to_sym] if status
  end

  def user_badge(status)
    USER_TYPES[status.to_sym] if status
  end
end
