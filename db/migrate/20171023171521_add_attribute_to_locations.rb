class AddAttributeToLocations < ActiveRecord::Migration[5.1]
  def change
    add_reference :locations, :attribute, foreign_key: true
  end
end
