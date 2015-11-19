PANDOC=pandoc --template templates/impress-template.html -V impress-url=http://impress.github.io/impress.js -s -t html5 --section-divs
OUTPUT_FOLDER=../../output/impress
SLIDES=$(wildcard *.md)
HTMLS=$(SLIDES:%.md=$(OUTPUT_FOLDER)/%.html)

build: $(OUTPUT_FOLDER) $(HTMLS)

$(OUTPUT_FOLDER):
	@mkdir -p $@

$(HTMLS):$(OUTPUT_FOLDER)/%.html:%.md
		@echo "Creating slides $@ with file $<."
		-@$(PANDOC) $< -o $@

.PHONY: build $(HTMLS)