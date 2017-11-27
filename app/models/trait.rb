class Trait < ApplicationRecord
  has_many :locations
  scoped_search on: [:name]
end
