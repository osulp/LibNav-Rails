class Location < ApplicationRecord
  scope :persistent, -> { where(persistent: true) }
  scope :on_floor, -> (floor_id) {where(floor_id: floor_id)}

  has_many :tags
  has_one :location_icon
  has_one :icon, through: :location_icon
  has_one :location_label
  has_one :label, through: :location_label

  belongs_to :floor, inverse_of: :locations

  has_and_belongs_to_many :traits

  scoped_search on: [:name]

  validates :name, :floor, :position_x, :position_y, :width, :height, presence: true

  # Necessary for rails_admin to set the associated model for a has one
  # association
  def icon_id
    self.icon.try :id
  end

  def icon_id=(id)
    self.icon = Icon.find_by_id(id)
  end

  def label_id
    self.label.try :id
  end

  def label_id=(id)
    self.label = Label.find_by_id(id)
  end

  def admin_url
    RailsAdmin::Engine.routes.url_helpers.edit_path(self.class.to_s.downcase, id)
  end

  def attributes
    super.merge({admin_url: admin_url,
                 icon_url: icon_url,
                 label_text: label_text})
  end

  def get_edit_map_props
    map_props = %i[width height position_x position_y id]
    map_props.each_with_object({}) { |prop, hash| hash[prop] = send(prop) if send(prop) }
  end

  def kiosk_only?
    traits.exists?(name: 'render-only-at-kiosk')
  end

  rails_admin do
    base do
      field :name
      field :background_color, :color
      field :floor
      field :persistent
      field :traits
      field :tags
      field :icon
      field :label
    end
  end

  private

  def label_text
    self.label.value unless self.label.nil?
  end

  def icon_url
    self.icon.icon_image.url unless self.icon.nil?
  end

  def self.is_persistent?
    self.persistent
  end
end
