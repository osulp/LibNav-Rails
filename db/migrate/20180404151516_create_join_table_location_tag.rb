class CreateJoinTableLocationTag < ActiveRecord::Migration[5.1]
  def change
    create_join_table :locations, :tags do |t|
      t.index [:location_id, :tag_id]
    end
  end
end
