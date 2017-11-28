class Trait < ApplicationRecord
  has_and_belongs_to_many :locations
  scoped_search on: [:name]
end
