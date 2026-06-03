default: help

PORT ?= 2663

# Local clone of the GitHub Pages site that hosts the public deck. We publish
# by pushing directly to the `gh-pages` branch via a throwaway worktree, so
# changes go live immediately. Customise SITE_REPO and the *_URL vars for your
# own site, or comment out the deploy targets if you do not publish.
SITE_REPO ?= $(HOME)/path/to/your-site-repo
GH_PAGES_WORKTREE := /tmp/conference-deck-gh-pages
PUBLIC_NOTES_URL := https://example.com/presentation/notes.html
PUBLIC_PRESENTATION_URL := https://example.com/presentation/presentation.html

.PHONY: help
help: # Show help for each of the Makefile recipes.
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done

.PHONY: dev
dev: # Serve the deck locally and open it in the browser.
	@echo "Serving on http://localhost:$(PORT)/presentation.html (Ctrl-C to stop)"
	@open "http://localhost:$(PORT)/presentation.html" || true
	@python3 -m http.server $(PORT)

.PHONY: notes
notes: # Serve and open the speaker-notes sheet.
	@echo "Serving on http://localhost:$(PORT)/notes.html (Ctrl-C to stop)"
	@open "http://localhost:$(PORT)/notes.html" || true
	@python3 -m http.server $(PORT)

.PHONY: lab
lab: # Serve and open any local labs (drafts/*.html). Edit the open list to taste.
	@open "http://localhost:$(PORT)/drafts/" || true
	@python3 -m http.server $(PORT)

.PHONY: deploy-presentation
deploy-presentation: # Publish presentation.html and its assets to gh-pages.
	@test -d "$(SITE_REPO)" || (echo "SITE_REPO not found: $(SITE_REPO)" && exit 1)
	cd "$(SITE_REPO)" && git fetch origin gh-pages
	@if [ -e "$(GH_PAGES_WORKTREE)" ]; then \
		echo "Removing stale worktree at $(GH_PAGES_WORKTREE)"; \
		cd "$(SITE_REPO)" && git worktree remove --force "$(GH_PAGES_WORKTREE)" 2>/dev/null || true; \
		rm -rf "$(GH_PAGES_WORKTREE)"; \
	fi
	cd "$(SITE_REPO)" && git worktree add "$(GH_PAGES_WORKTREE)" gh-pages
	mkdir -p "$(GH_PAGES_WORKTREE)/presentation/images"
	cp presentation.html "$(GH_PAGES_WORKTREE)/presentation/presentation.html"
	@if [ -d images ]; then cp -R images/* "$(GH_PAGES_WORKTREE)/presentation/images/" 2>/dev/null || true; fi
	cd "$(GH_PAGES_WORKTREE)" && git add presentation && \
		git commit -m "chore: update presentation (gh-pages direct)" && \
		git push origin gh-pages
	cd "$(SITE_REPO)" && git worktree remove --force "$(GH_PAGES_WORKTREE)"
	@echo ""
	@echo "Published. View: $(PUBLIC_PRESENTATION_URL)"

.PHONY: deploy-notes
deploy-notes: # Publish notes.html to gh-pages so it can be viewed on a phone.
	@test -d "$(SITE_REPO)" || (echo "SITE_REPO not found: $(SITE_REPO)" && exit 1)
	cd "$(SITE_REPO)" && git fetch origin gh-pages
	@if [ -e "$(GH_PAGES_WORKTREE)" ]; then \
		echo "Removing stale worktree at $(GH_PAGES_WORKTREE)"; \
		cd "$(SITE_REPO)" && git worktree remove --force "$(GH_PAGES_WORKTREE)" 2>/dev/null || true; \
		rm -rf "$(GH_PAGES_WORKTREE)"; \
	fi
	cd "$(SITE_REPO)" && git worktree add "$(GH_PAGES_WORKTREE)" gh-pages
	mkdir -p "$(GH_PAGES_WORKTREE)/presentation"
	cp notes.html "$(GH_PAGES_WORKTREE)/presentation/notes.html"
	cd "$(GH_PAGES_WORKTREE)" && git add presentation/notes.html && \
		git commit -m "chore: update presentation notes (gh-pages direct)" && \
		git push origin gh-pages
	cd "$(SITE_REPO)" && git worktree remove --force "$(GH_PAGES_WORKTREE)"
	@echo ""
	@echo "Published. View on phone: $(PUBLIC_NOTES_URL)"

.PHONY: deploy
deploy: deploy-presentation deploy-notes # Publish both presentation and notes to gh-pages.
