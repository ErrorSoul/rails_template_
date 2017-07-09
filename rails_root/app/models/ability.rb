class Ability
  include CanCan::Ability

  def initialize(user)
    case user.role
    when 'admin'
      can :manage, :all
    when 'operator'
      can [:read, :create],  [Order, Customer]
    when 'manager'
      can :manage, [Order, Customer]
    end
  end
end
