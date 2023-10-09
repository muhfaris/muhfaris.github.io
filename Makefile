dev:
	bundle exec jekyll serve

install:
	gem install bundler jekyll
	bundle config set --local path 'vendor/bundle'
	bundle install
