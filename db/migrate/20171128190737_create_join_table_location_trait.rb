class CreateJoinTableLocationTrait < ActiveRecord::Migration[5.1]
  def change
    create_join_table :locations, :traits do |t|
      t.index [:location_id, :trait_id]
    end
  end
end
