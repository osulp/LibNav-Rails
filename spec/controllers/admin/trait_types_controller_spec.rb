require 'rails_helper'

RSpec.describe Admin::TraitTypesController, type: :controller do
  let(:trait_type) {TraitType.create(:label => "Test TraitType")}
  let(:trait_type_params) { {trait_type:{id:"1", label:"Test TraitType"}} }
  let(:trait_type_id) { {id:trait_type.id} } 
  describe "GET index" do
    it "assigns trait_types and renders the index page" do
      get :index
      expect(assigns(:trait_types)).to eq([trait_type])
      expect(response).to render_template "admin/trait_types/index"
    end
  end
  describe "GET show" do
    it "should render the new page with an empty trait_type" do
      get :show, params: {id: trait_type.id}
      expect(assigns(:trait_type)).to eq(trait_type)
      expect(response).to render_template "admin/trait_types/show"
    end
  end
  context "As an admin" do
    let (:user) {User.create(:email => "admin@admin.org", :password => "admin123", :admin => "true")}
    before do
      sign_in(user) if user
    end
    describe "POST create" do
      it "should render the new page with an empty trait_type" do
        post :create, params: trait_type_params
        expect(response).to redirect_to("/admin/trait_types/1")
      end
    end
    describe "GET new" do
      it "should render the new page with an empty trait_type" do
        get :new
        expect(response).to render_template "admin/trait_types/new"
      end
    end
    describe "GET edit" do
      it "should render the new page with an empty trait_type" do
        get :edit, params: trait_type_id
        expect(assigns(:trait_type)).to eq(trait_type)
        expect(response).to render_template "admin/trait_types/edit"
      end
    end
    describe "PATCH update" do
      before do
        allow(controller).to receive(:trait_type_params).and_return({:label => "Updated Test TraitType"})
      end
      it "should render the new page with an empty trait_type" do
        patch :update, params: trait_type_id
        expect(assigns(:trait_type)).to eq(trait_type)
        expect(response).to redirect_to("/admin/trait_types/1")
      end
    end
    describe "DELETE destroy" do
      before do
        allow(controller).to receive(:trait_type_params).and_return({:label => "Updated Test TraitType"})
      end
      it "should render the new page with an empty trait_type" do
        patch :destroy, params: trait_type_id
        expect(assigns(:trait_type)).to eq(trait_type)
        expect(TraitType.all).to be_empty 
        expect(response).to redirect_to admin_trait_types_path
      end
    end
  end
  context "As an non-admin" do
    let (:user) {}
    before do
      sign_in(user) if user
    end
    describe "POST create" do
      it "should render the new page with an empty trait_type" do
        post :create
        expect(response).to redirect_to(root_path)
      end
    end
    describe "GET new" do
      it "should render the new page with an empty trait_type" do
        get :new
        expect(response).to redirect_to(root_path)
      end
    end
    describe "GET edit" do
      it "should render the new page with an empty trait_type" do
        get :edit, params: trait_type_id
        expect(response).to redirect_to(root_path)
      end
    end
    describe "PATCH update" do
      before do
        allow(controller).to receive(:trait_type_params).and_return({:label => "Updated Test TraitType"})
      end
      it "should render the new page with an empty trait_type" do
        patch :update, params: trait_type_id
        expect(response).to redirect_to(root_path)
      end
    end
    describe "DELETE destroy" do
      it "should render the new page with an empty trait_type" do
        patch :destroy, params: trait_type_id
        expect(response).to redirect_to(root_path)
      end
    end
  end
end
