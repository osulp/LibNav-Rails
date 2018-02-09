require 'rails_helper'

RSpec.describe FloorsController, type: :controller do 
  let(:user) {double("User")}
  let(:floor) {Floor.create(:name => "First Floor", :level => 1)}
  let(:other_floor) {Floor.create(:name => "Second Floor", :level => 2)}
  let(:kiosk_trait) {Trait.create(:name => 'render-only-at-kiosk', :value => 'Yes')}
  let(:trait) {Trait.create(:name => 'Blah', :value => 'Yes')}
  let(:controller_params) {{}}
  describe "#get_persistent_locations" do
    before do
      set_up_controller
    end
    context "when kiosk is disabled" do
      let(:controller_params) {{:search => "1957",
                                :floor_number => 1,
                                :kiosk => "false"}}
      context "and both a kiosk_only location and non kiosk only location exists" do
        before do
          build_persistent_locations_with_kiosk_only
          build_persistent_locations_without_kiosk_only
        end
        it "sets the state variable to only have the non location object" do
          get :index, params: controller_params

          expect(assigns(:state)[:persistent_locations].length).to eq 1
        end
      end
    end
    context "when kiosk is set to true" do
      let(:controller_params) {{:search => "1957",
                                :floor_number => 1,
                                :kiosk => "true"}}
      context "when a location with kiosk only trait and a location without kiosk only trait exists" do
        before do
          build_persistent_locations_with_kiosk_only
          build_persistent_locations_without_kiosk_only
        end
        it "returns both locations" do
          get :index, params: controller_params

          expect(assigns(:state)[:persistent_locations].length).to eq 2
        end
      end
      context "and another kiosk_only location exists on another floor" do
        before do
          build_persistent_locations_with_kiosk_only
          Location.create(:name => "Location With Kiosk Only", :floor => other_floor, :position_x => 10, :position_y => 10, :width => 10, :height => 10, :persistent => true, :traits => [kiosk_trait])
        end
        it "returns only the location on the selected floor" do
          get :index, params: controller_params

          expect(assigns(:state)[:persistent_locations].length).to eq 1
          expect(assigns(:state)[:persistent_locations].first.floor.level).to eq 1
        end
      end
      context "with a floor not being chosen" do
        let(:controller_params) {{:search => "1957",
                                  :kiosk => "true"}}
        context "and both types of locations exist" do
          before do
            build_persistent_locations_with_kiosk_only
            build_persistent_locations_without_kiosk_only
          end
          it "leaves the kiosk only location out" do
            get :index, params: controller_params

            expect(assigns(:state)[:persistent_locations].length).to eq 1
          end
        end
      end
    end
  end
end

def build_persistent_locations_with_kiosk_only
  Location.create(:name => "Location With Kiosk Only", :floor => floor, :position_x => 10, :position_y => 10, :width => 10, :height => 10, :persistent => true, :traits => [kiosk_trait])
end

def build_persistent_locations_without_kiosk_only
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
