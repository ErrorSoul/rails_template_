
%w[wizard mag healer warlock].each do |name|
  Category.create name: name
end

category_all = Category.all

user = User.create(
  first_name: 'John',
  last_name: 'Smith',
  role: 'admin'
  category_id: category_all.sample.id
)
