class AddLocationToFloor < ActiveRecord::Migration[5.1]
  def change
    add_reference :floors, :location, foreign_key: true
  end
end
