class ShowObject

  attr_reader :model_name, :elem

  def initialize(elem:)
    @elem = elem
    @attribute_names = elem.attribute_names - %w[created_at updated_at]
    @model_name = @elem.class.name.downcase
  end

  def attribute_names
    @attribute_names
  end

  def value(name)
    @elem.public_send(name)
  end

  def full_name
    "#{@elem.first_name} #{@elem.middle_name} #{@elem.last_name}"
  end
end
