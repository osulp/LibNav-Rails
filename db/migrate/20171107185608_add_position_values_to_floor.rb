class AddPositionValuesToFloor < ActiveRecord::Migration[5.1]
  def change
    add_column :floors, :bounding_box_x, :integer
    add_column :floors, :bounding_box_y, :integer
    add_column :floors, :bounding_box_width, :integer
    add_column :floors, :bounding_box_length, :integer
  end
end
