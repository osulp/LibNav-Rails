# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

floors = [
  { name: 'First Floor', level: 1 },
  { name: 'Second Floor - Main', level: 2 },
  { name: 'Third Floor', level: 3 },
  { name: 'Fourth Floor', level: 4 },
  { name: 'Fifth Floor', level: 5 },
  { name: 'Sixth Floor', level: 6 }
]

floors.each do |floor|
  Floor.create(floor) unless Floor.exists?(name: floor[:name])
end

locations = [
  { name: 'Circulation', position_x: 71, position_y: 121, width: 314, height: 151, floor_id: Floor.where(level: 2).first.id },
  { name: "2nd Floor Women's Restroom", position_x: 421, position_y: 520, width: 39, height: 67, floor_id: Floor.where(level: 2).first.id }
]

kiosk_locations = [
  { name: 'You Are Here - 4th Floor Kiosk', persistent: true, position_x: 267, position_y: 313, width: 9, height: 11, floor_id: Floor.where(level: 4).first.id },
  { name: 'You Are Here - 2nd Floor Kiosk', persistent: true, position_x: 440, position_y: 	265, width: 9, height: 11, floor_id: Floor.where(level: 2).first.id }
]

kiosk_trait = Trait.create(name: 'Kiosk', value: 'Yes') unless Trait.exists?(name: 'Kiosk')
kiosk_trait ||= Trait.where(name: 'Kiosk')

locations.each do |location|
  Location.create(location) unless Location.exists?(name: location[:name])
end

kiosk_locations.each do |kiosk_location|
  location = Location.create(kiosk_location) unless Location.exists?(name: kiosk_location[:name])
  location ||= Location.where(name: kiosk_location[:name]).first
  location.traits << kiosk_trait unless location.traits.include?(kiosk_trait)
  location.save
end
