class CreateIcons < ActiveRecord::Migration[5.1]
  def change
    create_table :icons do |t|

      t.timestamps
    end
  end
end
