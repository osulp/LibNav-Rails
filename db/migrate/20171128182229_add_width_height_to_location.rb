class AddWidthHeightToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :width, :integer
    add_column :locations, :height, :integer
  end
end
