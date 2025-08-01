#!/bin/bash

# check-conflicts.sh - Helper script to check and report merge conflicts

set -e

echo "Checking for merge conflicts..."

# Find all files with conflicts
CONFLICT_FILES=$(git diff --name-only --diff-filter=U)

if [ -z "$CONFLICT_FILES" ]; then
    echo "No merge conflicts found."
    exit 0
fi

echo "Found merge conflicts in the following files:"
echo "$CONFLICT_FILES" | while read -r file; do
    echo "  - $file"
done

# Count total conflicts
TOTAL_CONFLICTS=0
echo "$CONFLICT_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        CONFLICTS_IN_FILE=$(grep -c "<<<<<<< HEAD" "$file" || true)
        if [ "$CONFLICTS_IN_FILE" -gt 0 ]; then
            echo "    Conflicts in $file: $CONFLICTS_IN_FILE"
            TOTAL_CONFLICTS=$((TOTAL_CONFLICTS + CONFLICTS_IN_FILE))
        fi
    fi
done

echo ""
echo "Summary:"
echo "  Total files with conflicts: $(echo "$CONFLICT_FILES" | wc -l)"
echo "  These conflicts will be resolved by llxprt-code"

# Check for specific LLXPRT files that need special attention
IMPORTANT_FILES=(
    "src/providers/"
    "src/auth/"
    "src/ui/"
    "package.json"
    "README.md"
)

echo ""
echo "Checking conflicts in critical LLXPRT directories..."
for pattern in "${IMPORTANT_FILES[@]}"; do
    if echo "$CONFLICT_FILES" | grep -q "$pattern"; then
        echo "  ⚠️  Conflicts detected in $pattern - requires careful resolution"
    fi
done

exit 0