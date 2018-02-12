class Icon < ApplicationRecord
  has_many :location_icons
  has_many :locations, through: :location_icons

  has_attached_file :icon_image

  validates_attachment_content_type :icon_image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  validates :name, presence: true
  validates :icon_image, presence: true

  rails_admin do
    base do
      field :icon_image do
        thumb_method :medium
      end
      field :name
      field :locations do
        inline_add false
        nested_form false
      end
    end
  end
end
