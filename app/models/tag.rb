class Tag < ApplicationRecord
  belongs_to :location, optional: true
  scoped_search on: [:label]
end
