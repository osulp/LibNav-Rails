class Tag < ApplicationRecord
  scope :has_location, -> { joins(:locations).where('locations.id is not null') }
  has_and_belongs_to_many :locations
  scoped_search on: [:label]
  validates :label, presence: true, uniqueness: true

  def name
    label
  end

  rails_admin do
    base do
      field :label
      field :locations
    end
  end
end
