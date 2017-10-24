require "rails_helper"

RSpec.describe "routes for TraitTypes", :type => :routing do
  it "routes to /trait_types index page" do
    expect(:get => "admin/trait_types").to be_routable
  end
  it "routes to /trait_types create page" do
    expect(:post => "admin/trait_types").to be_routable
  end
  it "routes to /trait_types/new new page" do
    expect(:get => "admin/trait_types/new").to be_routable
  end
  it "routes to /trait_types/:id/edit edit page" do
    expect(:get => "admin/trait_types/1/edit").to be_routable
  end
  it "routes to /trait_types/:id show page" do
    expect(:get => "admin/trait_types/1").to be_routable
  end
  it "routes to /trait_types/:id update page" do
    expect(:patch => "admin/trait_types/1").to be_routable
  end
  it "routes to /trait_types/:id update page" do
    expect(:put => "admin/trait_types/1").to be_routable
  end
  it "routes to /trait_types/:id destroy page" do
    expect(:delete => "admin/trait_types/1").to be_routable
  end
end
