require 'rails_helper'

RSpec.describe FloorsController, type: :controller do 
  let(:user) {double("User")}
  let(:floor) {Floor.create(:name => "First Floor", :level => 1)}
  let(:kiosk_trait) {Trait.create(:name => 'render-only-at-kiosk', :value => 'Yes')}
  let(:trait) {Trait.create(:name => 'Blah', :value => 'Yes')}
  let(:controller_params) {{:search => "1957",
                            :floor_number => 1,
                            :kiosk => true}}
  describe "#get_persistent_locations" do
    context "when a both location with kiosk only trait and location without kiosk only trait exists"
    before do
      set_up_controller
      build_persistent_locations_with_kiosk_only
      build_persistent_locations_without_kiosk_only
    end

    it "should return both locations" do
      get :index, params: controller_params

      expect(assigns(:state)[:persistent_locations].length).to eq 2
    end
  end
end

def build_persistent_locations_with_kiosk_only
  Location.create(:name => "Location With Kiosk Only", :floor => floor, :position_x => 10, :position_y => 10, :width => 10, :height => 10, :persistent => true, :traits => [kiosk_trait])
end

def build_persistent_locations_without_kiosk_only
  byebug
  Location.create(:name => "Location Without Kiosk Only", :floor => floor, :position_x => 10, :position_y => 10, :width => 10, :height => 10, :persistent => true, :traits => [trait])
end

def set_up_controller
  allow(user).to receive(:admin?).and_return(true)
  allow(floor).to receive(:id).and_return(1)
  allow(controller).to receive(:process_search).with(controller_params[:search]).and_return([])
  allow(controller).to receive(:extract_locations).with([]).and_return([])
  allow(controller).to receive(:extract_floors).with([]).and_return([])
  allow(controller).to receive(:current_user).and_return(user)
  allow(controller).to receive(:user_signed_in?).and_return(true)
  allow(controller).to receive(:extract_floors).with([]).and_return([])
end
