class Tag < ApplicationRecord
  scope :has_location, -> { where.not(location_id: nil) }
  belongs_to :location, optional: true
  scoped_search on: [:label]
  validates :label, presence: true, uniqueness: true

  def name
    label
  end

  rails_admin do
    base do
      field :label
      field :location
    end
  end
end
