require 'rails_helper'

RSpec.describe Admin::AdminDashboardController, type: :controller do

  context "#index" do
    context "when an administrative user" do
      let(:user) { User.create(:email => "admin@adminemails.org", :password => "admin123", :admin => true) }
      before do
        sign_in(user) if user
      end
      it "should route you to the index page." do
        get :index

        expect(response.code).to eq "200"
      end
    end

    context "when not an administrative user" do
      let(:user) { User.create(:email => "admin@adminemails.org", :password => "admin123", :admin => false) }
      before do
        sign_in(user) if user
      end
      it "should route you to the index page." do
        get :index

        expect(response.code).to eq "302"
      end
    end
  end
end
