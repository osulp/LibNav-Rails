class Icon < ApplicationRecord
  scope :ordered, -> { order(:name) }
  has_many :location_icons
  has_many :locations, through: :location_icons

  has_attached_file :icon_image

  validates_attachment_content_type :icon_image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/svg+xml"]

  validates :name, presence: true
  validates :icon_image, presence: true

  def icon_url
    icon_image.url
  end

  def attributes
    super.merge({icon_url: icon_url})
  end

  rails_admin do
    base do
      field :icon_image, :paperclip do
        thumb_method :original
      end
      field :name
      field :locations do
        inline_add false
        nested_form false
      end
    end
  end
end
