class Superuser < ApplicationRecord

  has_secure_password

  validates :login, presence: true, uniqueness: true
  validates :password, presence: true, on: :create
end
