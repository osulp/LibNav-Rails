class AddNameToIcon < ActiveRecord::Migration[5.1]
  def change
    add_column :icons, :name, :string
  end
end
