# JAAB Website - Development Makefile

.PHONY: help install serve build clean

.DEFAULT_GOAL := help

help: ## Display this help screen
	@echo "-----------------------------------------------------------------------"
	@echo "  JAAB Website (jaab.tech) Development"
	@echo "-----------------------------------------------------------------------"
	@echo ""
	@echo "Usage: make \033[36m<target>\033[0m"
	@echo ""
	@echo "\033[1mTargets:\033[0m"
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

install: ## Install Ruby dependencies (Jekyll, etc.)
	@echo "Installing dependencies..."
	bundle install

serve: ## Serve the website locally with live reloading
	@echo "Starting local Jekyll server..."
	bundle exec jekyll serve --livereload

build: ## Build the static site into _site/ directory
	@echo "Building static site..."
	bundle exec jekyll build

clean: ## Remove build artifacts and Jekyll cache
	@echo "Cleaning up..."
	rm -rf _site
	rm -rf .jekyll-cache
	@echo "Cleaned."
