# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

floors = [
  { name: 'First Floor', level: 1 },
  { name: 'Second Floor', level: 2 },
  { name: 'Third Floor', level: 3 },
  { name: 'Fourth Floor', level: 4 },
  { name: 'Fifth Floor', level: 5 },
  { name: 'Sixth Floor', level: 6 }
]

floors.each do |floor|
  Floor.create(floor) unless Floor.exists?(name: floor[:name])
end

locations = [
  {:name => "Circulation", :position_x => 71, :position_y => 121, :width => 314, :height => 151, :floor_id => 2},
  {:name => "2nd Floor Women's Restroom", :position_x => 421, :position_y => 520, :width => 39, :height => 67, :floor_id => 2}
]

locations.each do |location|
  Location.create(location) unless Location.exists?(name: location[:name])
end
