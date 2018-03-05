class RemoveBoundingBoxFromFloor < ActiveRecord::Migration[5.1]
  def change
    remove_column :floors, :bounding_box_x, :integer
    remove_column :floors, :bounding_box_y, :integer
    remove_column :floors, :bounding_box_width, :integer
    remove_column :floors, :bounding_box_height, :integer
    remove_column :floors, :grid_size, :integer
  end
end
