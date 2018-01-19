class AddLocationIdAndIconIdToLocationIcon < ActiveRecord::Migration[5.1]
  def change
    add_column :location_icons, :location_id, :integer
    add_column :location_icons, :icon_id, :integer
  end
end
