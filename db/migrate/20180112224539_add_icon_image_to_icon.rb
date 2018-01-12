class AddIconImageToIcon < ActiveRecord::Migration[5.1]
  def self.up
    change_table :icons do |t|
      t.attachment :icon_image
    end
  end

  def self.down
    remove_attachment :icons, :icon_image
  end
end
