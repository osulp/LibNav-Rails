RSpec.describe Api::LocateController do
  context 'using HTML' do
    let(:params) { { format: 'html' } }
    describe '#show without location_code' do
      it 'GET redirects to the api default url' do
        get :show, params
        expect(response).to redirect_to(ENV['API_DEFAULT_REDIRECT_URL'])
      end
      it 'POST redirects to the api default url' do
        post :show, params
        expect(response).to redirect_to(ENV['API_DEFAULT_REDIRECT_URL'])
      end
    end
    context 'with location_code param' do
      let(:params) { { format: 'html', params: { location_code: 'bob' } } }
      describe '#show location_code' do
        before :each do
          allow(subject).to receive(:lookup_redirect_url).and_return('')
        end
        it 'GET redirects to the api default url' do
          get :show, params
          expect(response).to redirect_to(ENV['API_DEFAULT_REDIRECT_URL'])
        end
        it 'POST redirects to the api default url' do
          post :show, params
          expect(response).to redirect_to(ENV['API_DEFAULT_REDIRECT_URL'])
        end
      end
      describe '#show location_code' do
        before :each do
          allow(subject).to receive(:load_yaml).and_return('bob' => 'http://www.bobross.com')
        end
        it 'GET redirects to the configured url' do
          get :show, params
          expect(response).to redirect_to('http://www.bobross.com')
        end
        it 'POST redirects to the configured url' do
          post :show, params
          expect(response).to redirect_to('http://www.bobross.com')
        end
      end
    end
  end
  context 'using JSON' do
    let(:params) { { format: 'json' } }
    describe '#show' do
      it 'GET renders json' do
        get :show, params
        expect(response.body).to eq({ result: 'not-yet-implemented' }.to_json)
      end
      it 'POST renders json' do
        post :show, params
        expect(response.body).to eq({ result: 'not-yet-implemented' }.to_json)
      end
    end
  end
end
