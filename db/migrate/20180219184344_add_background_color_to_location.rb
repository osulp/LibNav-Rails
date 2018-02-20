class AddBackgroundColorToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :background_color, :string, default: 'transparent'
  end
end
