THEME=-V theme=beige
PANDOC=pandoc -t revealjs -f markdown_mmd -s -V revealjs-url=http://lab.hakim.se/reveal-js $(THEME)
OUTPUT_FOLDER=../../output/reveal
SLIDES=$(wildcard *.md)
HTMLS=$(SLIDES:%.md=$(OUTPUT_FOLDER)/%.html)

build: $(OUTPUT_FOLDER) $(HTMLS)

$(OUTPUT_FOLDER):
	@mkdir -p $@

$(HTMLS):$(OUTPUT_FOLDER)/%.html:%.md
		@echo "Creating slides $@ with file $<."
		-@$(PANDOC) $< -o $@

.PHONY: build $(HTMLS)