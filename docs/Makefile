#TRANSITION=-V transition=linear
#PANDOC=pandoc --template=templates/default.revealjs --standalone --section-divs -t revealjs --highlight-style=zenburn -s -V revealjs-url=assets/reveal.js -V revealjs-width:1600 $(THEME) $(TRANSITION)
#PANDOC=pandoc --standalone --section-divs -t revealjs --highlight-style=zenburn -s -V revealjs-url=assets/reveal.js -V width=1600 -V history=true $(THEME) $(TRANSITION)
PANDOC=pandoc -s --highlight-style zenburn

OUTPUT_FOLDER=../../output/docs
ASSETS=assets
DOCS=$(wildcard *.md)
HTMLS=$(DOCS:%.md=$(OUTPUT_FOLDER)/%.html)

build: $(OUTPUT_FOLDER) copy-assets $(HTMLS)

copy-assets:
	@rsync -arv $(ASSETS) $(OUTPUT_FOLDER)

$(OUTPUT_FOLDER):
	@mkdir -p $@

$(HTMLS):$(OUTPUT_FOLDER)/%.html:%.md
		@echo "Creating doc $@ with file $<."
		-@$(PANDOC) $< -o $@

.PHONY: build $(HTMLS)