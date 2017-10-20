require "rails_helper"

RSpec.describe "routes for Locations", :type => :routing do
  it "routes to /locations index page" do
    expect(:get => "admin/locations").to be_routable
  end
  it "routes to /locations create page" do
    expect(:post => "admin/locations").to be_routable
  end
  it "routes to /locations/new new page" do
    expect(:get => "admin/locations/new").to be_routable
  end
  it "routes to /locations/:id/edit edit page" do
    expect(:get => "admin/locations/1/edit").to be_routable
  end
  it "routes to /locations/:id show page" do
    expect(:get => "admin/locations/1").to be_routable
  end
  it "routes to /locations/:id update page" do
    expect(:patch => "admin/locations/1").to be_routable
  end
  it "routes to /locations/:id update page" do
    expect(:put => "admin/locations/1").to be_routable
  end
  it "routes to /locations/:id destroy page" do
    expect(:delete => "admin/locations/1").to be_routable
  end
end
