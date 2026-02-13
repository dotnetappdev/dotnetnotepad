# Release Guide

This guide explains how to create releases for .NET Notepad with automatic builds for all platforms.

## Prerequisites

- Repository access with push permissions
- Git installed locally

## Creating a New Release

### Step 1: Update Version Number

Update the version in `package.json`:
```json
{
  "version": "1.0.0.2"
}
```

Commit the version change:
```bash
git add package.json
git commit -m "Bump version to 1.0.0.2"
git push origin main
```

### Step 2: Create and Push a Git Tag

```bash
# Create a tag with the version (must start with 'v')
git tag v1.0.0.2

# Push the tag to GitHub
git push origin v1.0.0.2
```

### Step 3: Wait for Builds

Once you push the tag, GitHub Actions will automatically:

1. **Build Web Version** (on Ubuntu runner)
   - Compiles the TypeScript/React app
   - Creates `dotnetnotepad-web.zip`

2. **Build Windows** (on Windows runner)
   - Creates NSIS installer: `.NET Notepad Setup 1.0.0.2.exe`
   - Creates portable exe: `.NET Notepad 1.0.0.2.exe`

3. **Build Linux** (on Ubuntu runner)
   - Creates AppImage: `.NET Notepad-1.0.0.2.AppImage`
   - Creates DEB package: `dotnetnotepad_1.0.0.2_amd64.deb`

4. **Build macOS** (on macOS runner)
   - Creates DMG: `.NET Notepad-1.0.0.2.dmg`

5. **Create GitHub Release**
   - Automatically creates a release with all binaries
   - Generates release notes from commits
   - Tags the release with your version

### Step 4: Verify the Release

1. Go to `https://github.com/dotnetappdev/dotnetnotepad/releases`
2. Find your new release
3. Verify all platform binaries are attached
4. Edit the release notes if needed

## Manual Workflow Trigger

You can also trigger builds manually without creating a release:

1. Go to Actions tab in GitHub
2. Select "Build and Release" workflow
3. Click "Run workflow"
4. Select the branch
5. Click "Run workflow" button

This will build all platforms but won't create a release unless you're on a tagged commit.

## Building Locally

### Web Version
```bash
npm run build
```
Output: `dist/` directory

### Windows
```bash
npm run dist:win
```
Output: `release/*.exe` and `release/*.zip`

### Linux
```bash
npm run dist:linux
```
Output: `release/*.AppImage` and `release/*.deb`

### macOS
```bash
npm run dist:mac
```
Output: `release/*.dmg`

### All Platforms
```bash
npm run dist
```
Output: All platform builds in `release/` directory

**Note:** Building for macOS requires a macOS machine.

## Troubleshooting

### Build fails on GitHub Actions

1. Check the Actions tab for error logs
2. Common issues:
   - Missing dependencies: Ensure `package-lock.json` is committed
   - Build errors: Test locally with `npm run build`
   - Icon missing: Ensure `assets/icon.png` exists

### Release not created

1. Ensure tag starts with `v` (e.g., `v1.0.0.2`)
2. Check that the workflow has `contents: write` permission
3. Verify the tag was pushed: `git push origin v1.0.0.2`

### Missing platform builds

1. Check individual job logs in GitHub Actions
2. Ensure all jobs completed successfully
3. Re-run failed jobs from the Actions tab

## Distribution

Once a release is created, users can:

1. **Download from GitHub Releases:**
   - Visit the Releases page
   - Download the appropriate file for their platform

2. **Web Version:**
   - Extract `dotnetnotepad-web.zip`
   - Host on any web server
   - Or open `dist/index.html` locally

3. **Windows:**
   - Run the installer for full installation
   - Or use the portable exe (no installation)

4. **Linux:**
   - AppImage: `chmod +x *.AppImage && ./filename.AppImage`
   - DEB: `sudo dpkg -i dotnetnotepad_*.deb`

5. **macOS:**
   - Open the DMG file
   - Drag .NET Notepad to Applications folder

## Version Numbering

This project uses a four-segment version format: **Major.Minor.Patch.Build** (e.g., 1.0.0.1)

This is an extension of semantic versioning with an additional build number:
- Increment **Major** for breaking changes (e.g., 2.0.0.0)
- Increment **Minor** for new features (e.g., 1.1.0.0)
- Increment **Patch** for bug fixes (e.g., 1.0.1.0)
- Increment **Build** for small updates, hotfixes, or documentation changes (e.g., 1.0.0.2)

The fourth segment allows for quick iterations without affecting the semantic version.

## Automation Details

The GitHub Actions workflow (`.github/workflows/build-release.yml`):

- **Triggers:** On tag push (`v*`) or manual dispatch
- **Jobs:** 5 parallel jobs (web, windows, linux, macos, release)
- **Node Version:** 20.x
- **Caching:** npm dependencies cached for faster builds
- **Artifacts:** Stored for 90 days by default
- **Release:** Created only when triggered by a tag

## Next Steps

After a release:

1. Test downloads on each platform
2. Update release notes with highlights
3. Announce the release to users
4. Monitor for issues/bug reports
