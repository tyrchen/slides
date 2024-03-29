SUBDIR=slides/shower
OUTPUT_FOLDER=./output

all: $(SUBDIR)
	@aws s3 sync output s3://share.coderena.com/slides --profile stapin
	@echo "All slides are built."

clean:
		@rm -rf $(OUTPUT_FOLDER)/*
			@echo "All slides are cleaned."

$(SUBDIR):
	@$(MAKE) -C $@

.PHONY: all clean $(SUBDIR)
