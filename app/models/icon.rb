class Icon < ApplicationRecord
  has_many :location_icons
  has_many :locations, through: :location_icons

  has_attached_file :icon_image

  validates_attachment_content_type :icon_image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  rails_admin do
    base do
      field :icon_image do
        thumb_method :medium
      end
      field :name
      field :locations
    end
  end
end
