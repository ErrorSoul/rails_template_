class TableObject

  attr_reader :pool, :column_headers, :name

  def initialize(name: , pool:, attrs: )
    @name = name
    @constant = name.constantize
    @pool = pool

    @headers = attrs || (@constant.column_names.flatten.uniq - %w[created_at updated_at])
  end


  def model_name
    @name
  end

  def table_headers
    @headers.map { |col| prefilter(col) }
  end

  def column_headers
    @headers
  end

  def controller_name
    @name.downcase.pluralize
  end

  private

  def prefilter(col)
    col == 'id' ? "#" : col.capitalize
  end

end
