class AddAttachmentMapToFloors < ActiveRecord::Migration[5.1]
  def self.up
    change_table :floors do |t|
      t.attachment :map
    end
  end

  def self.down
    remove_attachment :floors, :map
  end
end
