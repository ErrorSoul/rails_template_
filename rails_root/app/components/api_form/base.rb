class ApiForm::Base
  PASSWORD_LENGTH = 6..12
  EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  PHONE_REGEX = /\A[+]7*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$\z/

  include ActiveModel::Model

  def self.attributes(*names)
    attr_accessor(*names)
  end

  def email_not_taken?
    query = ActiveRecord::Base.sanitize_sql(email)

    sql   = <<~SQL
      SELECT
        EXISTS (SELECT email FROM users WHERE LOWER(email) = '#{query}');
    SQL

    result = (ActiveRecord::Base.connection.select_value(sql) == false)

    was_taken_message = "Почта уже занята"
    errors.add(:email, :was_taken, { message: was_taken_message }) unless result

    result
  end

  def phone_free?
    query = ActiveRecord::Base.sanitize_sql(self.phone)
    sql   = <<~SQL
      SELECT
        EXISTS (SELECT phone FROM users WHERE phone = '#{query}');
    SQL

    result = (ActiveRecord::Base.connection.select_value(sql) == false)

    errors.add(
      :phone,
      :was_already_taken,
      { message: I18n.t("errors.phone.was_already_taken") }
    ) unless result

    result
  end

  def phone_correct?
    result = phone.present? && phone =~ PHONE_REGEX

    errors.add(
      :phone,
      :wrong_format,
      { message:  I18n.t("errors.phone.wrong_format") }
    ) unless result

    result
  end

end
