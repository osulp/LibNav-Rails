class AddTextPositioningToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :text_position_x, :integer
    add_column :locations, :text_position_y, :integer
  end
end
