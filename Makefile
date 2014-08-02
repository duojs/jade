BIN := ./node_modules/.bin

node_modules: package.json
	@npm install

test: node_modules
	@$(BIN)/gnode $(BIN)/_mocha

.PHONY: test
