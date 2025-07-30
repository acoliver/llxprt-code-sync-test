# Upstream Sync Workflow

## Overview
This workflow automatically syncs commits from an upstream repository using `llxprt-code` to handle cherry-picking and conflict resolution.

## Configuration

### Required Secrets
- `GOOGLE_API_KEY`: Required by llxprt-code for AI-powered conflict resolution

### Upstream Repository
Before using this workflow, update the upstream repository URL in the workflow file:
```yaml
git remote add upstream https://github.com/UPSTREAM_OWNER/UPSTREAM_REPO.git
```

## Schedule
- **Automatic**: Runs daily at 3 AM ART (UTC-3) / 6 AM UTC
- **Manual**: Can be triggered via GitHub Actions UI using workflow_dispatch

## How It Works

1. **Check for Updates**: Fetches upstream and checks for new commits
2. **Create Branch**: Creates a new branch with timestamp (e.g., `upstream-sync-20240130-123456`)
3. **Run llxprt-code**: Executes with `--yolo` flag and 45-minute timeout
4. **Conflict Detection**: Searches for merge conflict markers (`<<<<<<<`)
5. **Create PR**: Opens a PR with detailed information about:
   - Number of commits synced
   - Conflict status
   - llxprt-code execution results
   - List of commits cherry-picked

## Handling Failures

### Merge Conflicts
If conflicts are detected:
1. The PR will be marked with "⚠️ Conflicts need resolution"
2. Check the PR description for conflicted files
3. Manually resolve conflicts in the branch
4. Push the resolution

### llxprt-code Timeout
If llxprt-code exceeds 45 minutes:
1. The workflow will fail
2. Check the PR/logs for partial progress
3. Consider running manually with smaller batches

## Manual Execution
To run manually:
1. Go to Actions tab
2. Select "Upstream Sync" workflow
3. Click "Run workflow"
4. Select branch and run

## Monitoring
- Check the Actions tab for workflow runs
- Review created PRs with "upstream-sync" label
- Monitor for conflict warnings in PR titles