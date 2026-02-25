---
name: makefile-development
description: This skill should be used when the user asks to "create a Makefile", "write a Makefile", "add a make target", or mentions Makefile conventions.
---

# Makefile Development

Create Makefiles following consistent conventions.

## Template

```makefile
default: help

.PHONY: help
help: # Show help for each of the Makefile recipes.
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done

.PHONY: init
init: # Initialise the development environment.
	./scripts/init.sh
```

## Conventions

| Element | Convention |
|---------|------------|
| Filename | `Makefile` (capitalised, no extension) |
| Default target | `default: help` as the first line |
| `.PHONY` | Declare directly above each target |
| Help comments | Single `#` on the target line: `target: # Description.` |
| Target names | Lowercase, hyphen-separated (`test-e2e`, `type-check`) |
| Complex logic | Delegate to scripts (`./scripts/build.sh`) rather than inline |

## Help Target

The self-documenting help target parses `#` comments and prints sorted, colour-coded output:

```makefile
.PHONY: help
help: # Show help for each of the Makefile recipes.
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done
```

Every target must have a `# Description.` comment or it won't appear in help output.

## Common Targets

| Target | Purpose |
|--------|---------|
| `help` | Show available targets (always present) |
| `init` or `setup` | Install dependencies, configure environment |
| `build` | Compile or bundle artifacts |
| `dev` | Start local development server |
| `test` | Run test suite |
| `lint` | Run linters and formatters |

## Important

After creating or modifying Makefiles, remind the user:

> **Use tabs.** Makefile recipes require literal tab characters for indentation, not spaces.
