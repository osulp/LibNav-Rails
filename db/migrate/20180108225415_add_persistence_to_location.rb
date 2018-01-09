class AddPersistenceToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :persistent, :boolean
  end
end
