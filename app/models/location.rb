class Location < ApplicationRecord
  scope :persistent, -> { where(persistent: true) }

  has_many :tags
  has_many :location_icons
  has_many :icons, through: :location_icons
  has_many :location_labels
  has_many :labels, through: :location_labels

  belongs_to :floor, inverse_of: :locations

  has_and_belongs_to_many :traits

  scoped_search on: [:name]

  validates :name, :floor, :position_x, :position_y, :width, :height, presence: true

  def admin_url
    RailsAdmin::Engine.routes.url_helpers.edit_path(self.class.to_s.downcase, id)
  end

  def attributes
    super.merge(icon_url: icon_url)
  end

  def get_edit_map_props
    map_props = %i[width height position_x position_y id]
    map_props.each_with_object({}) { |prop, hash| hash[prop] = send(prop) if send(prop) }
  end

  def attributes
    super.merge(admin_url: admin_url)
  end

  rails_admin do
    base do
      field :name
      field :floor
      field :position_x
      field :position_y
      field :width
      field :height
      field :persistent
      field :traits
      field :tags
      field :icons
    end
  end

  private

  def icon_url
    self.icons.first.icon_image.url unless self.icons.empty?
  end

  def self.is_persistent?
    self.persistent
  end
end
