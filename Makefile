size:
	babel index.js | uglifyjs -m -c | gzip | wc -c
build:
	babel ./src/index.js > ./lib/index.js

.PHONY: size build