# README
[![Coverage Status](https://coveralls.io/repos/github/osulp/LibNav-Rails/badge.svg?branch=master)](https://coveralls.io/github/osulp/LibNav-Rails?branch=master)

The application is built as a combination of traditional Ruby on Rails for the backend and frontend administration interfaces along with a React app for the front end.

# Setup
- First run `yarn` to install dependancies.
- Next run any migrations using `rails db:migrate`.
- If desired run `rails db:seed` to populate the database with test data.
- Lastly run `rails s` to fire up the rails server.

# Dependencies
- Ruby 2.4.1
- NVM 0.33.5
- Yarn >= 1.2.0
- Webpack 3.6.0
- Rails 5.1.5

# Application build notes
- Yarn is used in place of npm for its improved handling of node module dependencies. 
- Webpack is used for compiling the React app and watching the javascript files. 

# Development workflow
Scripts found in `package.json` are designed to aid in typical development needs. All of the React app code is found in `app/javascripts/components`. 
- **Install `node_modules`** : Run `yarn` in the application root directory to install dependencies.
- Run `rails s` to run the rails server and use the app
- If migrations exist run `rails db:migrate`
- Seeded data is present and injectable into the database via `rails db:seed`

# React app directory structure
App code is found in `app/javascripts/components`
