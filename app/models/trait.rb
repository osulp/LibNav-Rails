class Trait < ApplicationRecord
  scope :has_location, -> { joins(:locations).where('locations.id is not null') }
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
