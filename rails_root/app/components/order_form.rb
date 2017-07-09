class OrderForm
  include ActiveModel::Model
  # All the models that are apart of our form should be part attr_accessor.
  # This allows the form to be initialized with existing instances.
  attr_accessor :customer, :order, :product_lists

  def product_lists_attributes=(attributes)
    order.product_lists_attributes=  attributes
  end

  def self.customer_attributes
    Customer.column_names.push(Customer.reflections.keys).flatten - %w[campaign_id]
  end

  def self.order_attributes
    Order.column_names.push(Order.reflections.keys).flatten
  end

  customer_attributes.each do |attr|
    delegate attr.to_sym, "#{attr}=".to_sym, to: :customer
  end

  order_attributes.each do |attr|
    delegate attr.to_sym, "#{attr}=".to_sym, to: :order
  end

  validates :product_lists, presence: true
  validates :last_name, :first_name, :middle_name, :dob, :phones, :email, :address,  presence: true
  validates :campaign_id, :order_date, :source, :cod, :delivery_charge, :total_amount, :gender,  presence: true
  delegate :id, :persisted?, :order_date, to: :order
  delegate :campaign_id=, :campaign_id, to: :order
  delegate :product_list_attributes=, to: :order, prefix: false, allow_nil: false

  validate :validate_children

  def assign_attributes(params)
    customer_attributes = params.slice(*self.class.customer_attributes)
    customer.assign_attributes(customer_attributes)
    order_attributes = params.slice(*self.class.order_attributes)
    order.assign_attributes(order_attributes)

    order.product_lists_attributes = params["product_lists_attributes"] || {}
    setup_associations
  end

  def set(customer:, order:, product_lists:)
    @customer = customer
    @order = order
    @product_lists = product_lists
  end

  def save
    if valid?
      ActiveRecord::Base.transaction do
        customer.save!
        order.save!
      end
    end
  end

  def customer
    @customer ||= Customer.new
  end

  def order
    @order ||= Order.new
  end

  private

  def setup_associations
    order.customer = customer
    order.product_lists = order.product_lists.empty? ? [ProductList.new] : order.product_lists
  end

  def validate_children
    setup_associations

    if customer.invalid?
      promote_errors(customer.errors)
    end

    if order.invalid?
      promote_errors(order.errors)
    end
  end

  def promote_errors(child_errors)
    child_errors.each do |attribute, message|
      if attribute.to_s.split('.').size > 1
        order.product_lists.each_with_index do |pl, index|
          pl.valid?
          errors.add(attribute, {index => message })
        end
      else
        errors.add(attribute, message)
      end
    end
  end
end
