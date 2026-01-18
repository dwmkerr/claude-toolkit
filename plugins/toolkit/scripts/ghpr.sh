#!/usr/bin/env bash
#
# ghpr - open existing GitHub pull request for current branch
#
# Usage:
#   ghpr
#
# If a PR exists for the current branch, opens it in the browser and prints
# the URL. If no PR exists, prints NO_PR and exits with code 1.
#
# This script provides the fast path for /ghpr - if no PR exists, the
# slash command handles creation with LLM assistance.

set -e -o pipefail

green='\033[0;32m'
nc='\033[0m'

if url=$(gh pr view --json url --jq '.url' 2>/dev/null); then
    gh pr view --web
    echo -e "${green}✔${nc} opened: $url"
    exit 0
else
    echo "NO_PR"
    exit 1
fi
