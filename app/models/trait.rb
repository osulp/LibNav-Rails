class Trait < ApplicationRecord
  has_and_belongs_to_many :locations
  scoped_search on: [:name]
  validates :name, :value, presence: true
  validates :name, uniqueness: true

  rails_admin do
    base do
      field :name
      field :value
      field :locations
    end
  end
end
