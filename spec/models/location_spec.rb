require 'rails_helper'

RSpec.describe Location, type: :model do
  describe "#kiosk_only?" do
    let(:location) {described_class.new}
    let(:kiosk_trait) {Trait.create(name: "blah", value: 'Yes')}
    context "When a location has a trait named render-only-at-kiosk" do
      let(:kiosk_trait) {Trait.create(name: "render-only-at-kiosk", value: 'Yes')}
      before do
        allow(location).to receive(:traits).and_return(Trait.where(name: kiosk_trait.name))
      end
      it "returns a true value" do
        expect(location.kiosk_only?).to eq true
      end
    end
    context "When a location does not have a trait named render-only-at-kiosk" do
      before do
        allow(location).to receive(:traits).and_return(Trait.where(name: kiosk_trait.name))
      end
      it "returns a false value" do
        expect(location.kiosk_only?).to eq false
      end
    end
  end
end
