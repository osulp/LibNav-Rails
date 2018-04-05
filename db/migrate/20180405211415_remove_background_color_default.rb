class RemoveBackgroundColorDefault < ActiveRecord::Migration[5.1]
  def change
    change_column :locations, :background_color, :string, null: true
  end
end
