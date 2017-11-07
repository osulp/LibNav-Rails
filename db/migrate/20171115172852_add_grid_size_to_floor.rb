class AddGridSizeToFloor < ActiveRecord::Migration[5.1]
  def change
    add_column :floors, :grid_size, :integer
  end
end
