#!/bin/bash

# Script to check for merge conflicts after llxprt-code execution
# This can be run locally or in CI to verify conflict resolution

set -e

echo "🔍 Checking for merge conflicts..."

# Find all files with conflict markers
CONFLICT_FILES=$(git grep -l "^<<<<<<< " 2>/dev/null || true)

if [ -z "$CONFLICT_FILES" ]; then
    echo "✅ No merge conflicts found!"
    exit 0
else
    echo "⚠️  Found merge conflicts in the following files:"
    echo "$CONFLICT_FILES" | while read -r file; do
        echo "  - $file"
        # Show the conflict markers in context
        echo "    Conflicts at lines:"
        git grep -n "^<<<<<<< " "$file" | cut -d: -f2 | while read -r line; do
            echo "      Line $line"
        done
    done
    
    echo ""
    echo "Total files with conflicts: $(echo "$CONFLICT_FILES" | wc -l)"
    exit 1
fi