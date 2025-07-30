# Implement Lines of Code Display with GitHub Action

## Summary
Currently, the portfolio website displays "∞" for Lines of Code in the hero stats section. We need to implement an automated system that counts the total lines of code across all non-forked GitHub repositories and updates the display to show the actual count (similar to murraykopit.com's "137M+").

## Current State
- **Display Location**: `index.html` line 72-73 shows "∞" for Lines of Code
- **JavaScript Handler**: `js/main.js` lines ~300-310 already has code to fetch and update from `/stats-simple.json`
- **Data Files**: 
  - `/stats-simple.json` exists with correct structure but shows 0 lines
  - `/stats.json` exists for detailed repository data
- **No GitHub Actions**: No `.github/workflows/` directory exists yet

## Requirements

### 1. GitHub Action Workflow
Create `.github/workflows/update-loc-stats.yml` that:
- Runs every 24 hours (cron: `0 0 * * *`)
- Can be manually triggered (workflow_dispatch)
- Uses GitHub API to fetch all repositories for the user
- Filters out forked repositories
- Counts lines of code using a tool like `tokei` or `cloc`
- Updates both `stats-simple.json` and `stats.json`
- Commits and pushes changes back to the repository

### 2. Lines of Code Counting
- **Tool Selection**: Use `tokei` for speed or `cloc` for accuracy
- **Exclusions**: 
  - Ignore common non-code files (images, binaries, etc.)
  - Exclude vendor/node_modules directories
  - Skip forked repositories
- **Languages**: Count all programming languages but provide breakdown in `stats.json`

### 3. Data Format
**stats-simple.json** (for quick frontend consumption):
```json
{
  "lines_of_code": 137000000,
  "repositories": 42,
  "last_updated": "2025-07-29T00:00:00Z",
  "formatted": "137M+"
}
```

**stats.json** (detailed breakdown):
```json
{
  "timestamp": "2025-07-29T00:00:00Z",
  "repositories": [
    {
      "name": "repo-name",
      "url": "https://github.com/murr2k/repo-name",
      "lines_of_code": 50000,
      "languages": {
        "JavaScript": 30000,
        "Python": 15000,
        "CSS": 5000
      },
      "is_fork": false
    }
  ],
  "total_lines": 137000000,
  "total_repos": 42,
  "language_totals": {
    "JavaScript": 50000000,
    "Python": 40000000,
    "Java": 30000000,
    "CSS": 7000000
  }
}
```

### 4. Display Formatting
- Numbers < 1,000: Show as-is (e.g., "842")
- Numbers 1,000-999,999: Show with K suffix (e.g., "15.2K")
- Numbers 1M-999M: Show with M suffix (e.g., "137M")
- Numbers >= 1B: Show with B suffix (e.g., "1.2B")
- Always append "+" to indicate it's a minimum count

### 5. Frontend Updates
The existing JavaScript code in `main.js` already handles:
- Fetching `/stats-simple.json`
- Updating the DOM element
- Adding a hover tooltip with detailed information

No frontend changes needed - it will automatically work once the JSON files are populated.

## Implementation Steps

1. **Create GitHub Action workflow**
   - Set up Node.js environment
   - Install counting tool (tokei/cloc)
   - Use GitHub API or GraphQL to fetch all repositories
   - Clone or use API to count lines per repository

2. **Create counting script**
   - Node.js script that orchestrates the counting
   - Handles API pagination
   - Filters repositories
   - Formats output for both JSON files

3. **Test locally**
   - Ensure script works with personal access token
   - Verify output format matches expected structure
   - Test number formatting logic

4. **Deploy and monitor**
   - Add necessary secrets (if any)
   - Monitor first few runs
   - Verify website updates correctly

## Security Considerations
- Use `GITHUB_TOKEN` provided by Actions (no additional secrets needed)
- Ensure the Action only has write permissions to specific files
- Consider rate limiting implications for users with many repositories

## Alternatives Considered
1. **Client-side counting**: Too slow and would hit API rate limits
2. **Manual updates**: Not sustainable or accurate
3. **Third-party services**: Adds unnecessary dependencies

## Success Criteria
- [ ] Lines of Code displays actual count instead of "∞"
- [ ] Count updates automatically every 24 hours
- [ ] Includes all non-forked repositories
- [ ] Shows formatted number (e.g., "137M+")
- [ ] Hover tooltip shows repository count and last updated time
- [ ] Action runs reliably without manual intervention

## References
- [tokei](https://github.com/XAMPPRocky/tokei) - Fast code counter
- [cloc](https://github.com/AlDanial/cloc) - Accurate code counter
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- Current implementation: `js/main.js` lines 300-310