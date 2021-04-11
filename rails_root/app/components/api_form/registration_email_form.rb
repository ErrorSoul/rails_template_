class ApiForm::RegistrationEmailForm < ApiForm::Base

  names =
    %i[
      email
      password
     ]

  attributes(*names)

  validates(*names, presence: { message: 'Не может быть пустым' })
  validates :email, format: { with: EMAIL_REGEX, message: 'Неправильный формат' }
  validate  :email_not_taken?
  validates :password, length: { in: PASSWORD_LENGTH }


  def create
    if valid?
      persist!
    else
      false
    end
  end

  def user
    @user
  end

  private

  def persist!
    @user = User.create!(
      email: email,
      password: password
    )
  end

end
