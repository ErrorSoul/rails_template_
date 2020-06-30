class ApiForm::RegistrationForm < ApiForm::Base

   names =
    %i[
      phone
      password
     ]

  attributes(*names)

  validates(*names, presence: { message: 'Не может быть пустым' })
  validate  :phone_correct?
  validate  :phone_free?

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
      phone: phone,
      password: password
    )
  end
end
