
test:
	@./node_modules/.bin/mocha \
		--require co-mocha \
		--harmony-generators \
		--reporter spec

.PHONY: test
