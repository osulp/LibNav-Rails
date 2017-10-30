class AddTraitToLocations < ActiveRecord::Migration[5.1]
  def change
    add_reference :locations, :trait, foreign_key: true
  end
end
