class Icon < ApplicationRecord
  has_many :locations
  has_attached_file :icon_image

end
