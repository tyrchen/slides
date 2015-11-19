SUBDIR=slides/reveal slides/impress
OUTPUT_FOLDER=./output

all: $(SUBDIR)
	@echo "All slides are built."

clean:
		@rm -rf $(OUTPUT_FOLDER)/*
			@echo "All slides are cleaned."

$(SUBDIR):
	@$(MAKE) -C $@

.PHONY: all clean $(SUBDIR)
