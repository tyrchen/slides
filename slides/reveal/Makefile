#THEME=-V theme=beige
TRANSITION=-V transition=linear
#PANDOC=pandoc --template=templates/default.revealjs --standalone --section-divs -t revealjs --highlight-style=zenburn -s -V revealjs-url=assets/reveal.js -V revealjs-width:1600 $(THEME) $(TRANSITION)
PANDOC=pandoc --standalone --section-divs -t revealjs --highlight-style=zenburn -s -V revealjs-url=assets/reveal.js -V width=1600 $(THEME) $(TRANSITION)
#PANDOC=pandoc --standalone --section-divs -t revealjs --highlight-style=zenburn -s -V revealjs-url=http://lab.hakim.se/reveal-js $(THEME) $(TRANSITION)
#PANDOC=pandoc -t html5 --template=templates/template-revealjs.html \
	--standalone --section-divs \
	--variable theme="beige" \
	--variable transition="linear" \
	-V revealjs-url=http://lab.hakim.se/reveal-js

OUTPUT_FOLDER=../../output/reveal
ASSETS=assets
SLIDES=$(wildcard *.md)
HTMLS=$(SLIDES:%.md=$(OUTPUT_FOLDER)/%.html)

build: $(OUTPUT_FOLDER) copy-assets $(HTMLS)

copy-assets:
	@rsync -arv $(ASSETS) $(OUTPUT_FOLDER)

$(OUTPUT_FOLDER):
	@mkdir -p $@

$(HTMLS):$(OUTPUT_FOLDER)/%.html:%.md
		@echo "Creating slides $@ with file $<."
		-@$(PANDOC) $< -o $@

.PHONY: build $(HTMLS)