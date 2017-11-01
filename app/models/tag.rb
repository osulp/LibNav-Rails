class Tag < ApplicationRecord
  belongs_to :location, optional: true
end
