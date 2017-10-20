require 'rails_helper'

RSpec.describe Admin::LocationsController, type: :controller do
  let(:location) {Location.create(:name => "Test Location")}
  let(:location_params) { {location:{id:"1", name:"Test Location"}} }
  let(:location_id) { {id:location.id} } 
  describe "GET index" do
    it "assigns locations and renders the index page" do
      get :index
      expect(assigns(:locations)).to eq([location])
      expect(response).to render_template "admin/locations/index"
    end
  end
  describe "GET show" do
    it "should render the new page with an empty location" do
      get :show, params: {id: location.id}
      expect(assigns(:location)).to eq(location)
      expect(response).to render_template "admin/locations/show"
    end
  end
  context "As an admin" do
    let (:user) {User.create(:email => "admin@admin.org", :password => "admin123", :admin => "true")}
    before do
      sign_in(user) if user
    end
    describe "POST create" do
      it "should render the new page with an empty location" do
        post :create, params: location_params
        expect(response).to redirect_to("/admin/locations/1")
      end
    end
    describe "GET new" do
      it "should render the new page with an empty location" do
        get :new
        expect(response).to render_template "admin/locations/new"
      end
    end
    describe "GET edit" do
      it "should render the new page with an empty location" do
        get :edit, params: location_id
        expect(assigns(:location)).to eq(location)
        expect(response).to render_template "admin/locations/edit"
      end
    end
    describe "PATCH update" do
      before do
        allow(controller).to receive(:location_params).and_return({:name => "Updated Test Location"})
      end
      it "should render the new page with an empty location" do
        patch :update, params: location_id
        expect(assigns(:location)).to eq(location)
        expect(response).to redirect_to("/admin/locations/1")
      end
    end
    describe "DELETE destroy" do
      before do
        allow(controller).to receive(:location_params).and_return({:name => "Updated Test Location"})
      end
      it "should render the new page with an empty location" do
        patch :destroy, params: location_id
        expect(assigns(:location)).to eq(location)
        expect(Location.all).to be_empty 
        expect(response).to redirect_to admin_locations_path
      end
    end
  end
  context "As an non-admin" do
    let (:user) {}
    before do
      sign_in(user) if user
    end
    describe "POST create" do
      it "should render the new page with an empty location" do
        post :create
        expect(response).to redirect_to(root_path)
      end
    end
    describe "GET new" do
      it "should render the new page with an empty location" do
        get :new
        expect(response).to redirect_to(root_path)
      end
    end
    describe "GET edit" do
      it "should render the new page with an empty location" do
        get :edit, params: location_id
        expect(response).to redirect_to(root_path)
      end
    end
    describe "PATCH update" do
      before do
        allow(controller).to receive(:location_params).and_return({:name => "Updated Test Location"})
      end
      it "should render the new page with an empty location" do
        patch :update, params: location_id
        expect(response).to redirect_to(root_path)
      end
    end
    describe "DELETE destroy" do
      it "should render the new page with an empty location" do
        patch :destroy, params: location_id
        expect(response).to redirect_to(root_path)
      end
    end
  end
end
