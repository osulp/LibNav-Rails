class CreateTraitTypes < ActiveRecord::Migration[5.1]
  def change
    create_table :trait_types do |t|
      t.string :label
      t.text :values

      t.timestamps
    end
  end
end
