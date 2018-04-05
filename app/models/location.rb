class Location < ApplicationRecord
  scope :persistent, -> { where(persistent: true) }
  scope :on_floor, -> (floor_id) {where(floor_id: floor_id)}

  has_one :location_icon
  has_one :icon, through: :location_icon
  has_one :location_label
  has_one :label, through: :location_label

  belongs_to :floor, inverse_of: :locations

  has_and_belongs_to_many :tags
  has_and_belongs_to_many :traits

  scoped_search on: [:name]

  validates :name, :floor, :position_x, :position_y, :width, :height, presence: true
  before_save :allowable_text_position
  before_save :allowable_icon_position

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
                 text: text,
                 icon_name: icon_name})
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
      #field :icon
      field :label
    end
  end

  private

  def text
    self.label.value unless self.label.nil?
  end

  def icon_url
    self.icon.icon_image.url unless self.icon.nil?
  end

  def icon_name
    self.icon.name unless self.icon.nil?
  end

  def self.is_persistent?
    self.persistent
  end

  def allowable_text_position
    unless self.label.nil?
      text_position_x = position_x if text_position_x.nil? || text_position_x < position_x
      text_position_y = position_y if text_position_y.nil? || text_position_y < position_y
    end
  end

  def allowable_icon_position
    unless self.icon.nil?
      icon_position_x = position_x if icon_position_x.nil? || icon_position_x < position_x
      icon_position_y = position_y if icon_position_y.nil? || icon_position_y < position_y
    end
  end
end
