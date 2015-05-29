size:
	babel index.js | uglifyjs -m -c | gzip | wc -c

.PHONY: size