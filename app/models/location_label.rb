class LocationLabel < ApplicationRecord
  belongs_to :location
  belongs_to :label
end
