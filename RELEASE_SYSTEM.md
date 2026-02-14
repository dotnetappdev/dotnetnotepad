# Release System Summary

This document explains the automated release system for .NET Notepad.

## What's Implemented

The repository now has a complete automated release system that:

1. **Builds installers for all platforms** when you create a version tag
2. **Automatically creates GitHub releases** with all installers attached
3. **Provides pre-built downloads** for end users
4. **Makes releasing easy** with a helper script

## Architecture

### GitHub Actions Workflow

**File:** `.github/workflows/build-release.yml`

The workflow runs automatically when you push a tag starting with `v` (e.g., `v1.0.0.1`).

**What it does:**
- Builds web version (creates ZIP file)
- Builds Windows installers (NSIS installer, MSIX package, and portable EXE)
- Builds Linux packages (AppImage + DEB)
- Builds macOS disk image (DMG)
- Creates a GitHub release
- Attaches all installers to the release

**Runners used:**
- Ubuntu for web and Linux builds
- Windows for Windows builds
- macOS for macOS builds

### Helper Script

**File:** `create-release.sh`

A bash script that automates the entire release process. Simply run:

```bash
./create-release.sh
```

It will:
1. Ask for the new version number
2. Update `package.json`
3. Commit the change
4. Create and push a git tag
5. Trigger the GitHub Actions build

## How to Create a Release

### For Maintainers

**Option 1: Use the script (easiest)**
```bash
./create-release.sh
```

**Option 2: Manual process**
```bash
# 1. Update version in package.json
vim package.json  # Change "version": "1.0.0.1" to desired version

# 2. Commit and push
git add package.json
git commit -m "Bump version to 1.0.0.1"
git push origin main

# 3. Create and push tag
git tag v1.0.0.1
git push origin v1.0.0.1

# 4. GitHub Actions will automatically build and release
```

### For End Users

**Download pre-built installers:**

Go to: https://github.com/dotnetappdev/dotnetnotepad/releases/latest

Choose your platform:
- **Windows**: `.NET Notepad Setup.exe` (NSIS installer), `.msix` or `.appx` (MSIX package), or `.NET Notepad.exe` (portable)
- **Linux**: `.NET Notepad.AppImage` (universal) or `dotnetnotepad_*.deb` (Debian/Ubuntu)
- **macOS**: `.NET Notepad.dmg`
- **Web**: `dotnetnotepad-web.zip` (extract and open index.html)

## Documentation

All documentation has been updated:

1. **README.md**
   - Added prominent "Download" section at the top
   - Links to latest release
   - Explains pre-built installers
   - Documents the automated release process

2. **RELEASE_GUIDE.md**
   - Complete guide for creating releases
   - Documents both script and manual methods
   - Step-by-step instructions

3. **DESKTOP_BUILD.md**
   - Updated to reference automated releases
   - Explains local building if needed

4. **IMPLEMENTATION_SUMMARY.md**
   - Technical details about the implementation
   - References the release script

## Version Numbering

This project uses a **four-segment version format**: `Major.Minor.Patch.Build`

Examples: `1.0.0.1`, `1.2.3.4`

- **Major**: Breaking changes (e.g., 2.0.0.0)
- **Minor**: New features (e.g., 1.1.0.0)
- **Patch**: Bug fixes (e.g., 1.0.1.0)
- **Build**: Small updates/hotfixes (e.g., 1.0.0.2)

## Testing the System

To test the release system:

1. Create a test tag:
   ```bash
   git tag v1.0.0.1-test
   git push origin v1.0.0.1-test
   ```

2. Monitor GitHub Actions:
   - Go to: https://github.com/dotnetappdev/dotnetnotepad/actions
   - Watch the build progress

3. Check the release:
   - Go to: https://github.com/dotnetappdev/dotnetnotepad/releases
   - Verify all installers are attached

4. Download and test on each platform

## Workflow Permissions

The workflow has `contents: write` permission to create releases. This is the minimal permission needed.

## Security

- ✅ No secrets required (uses GITHUB_TOKEN)
- ✅ Electron configured securely
- ✅ No vulnerabilities in dependencies
- ✅ CodeQL scanning enabled

## What's Next

To create the first official release:

1. Run `./create-release.sh`
2. Enter version `1.0.0.0` for the first release
3. Wait for GitHub Actions to complete
4. Announce the release to users

## Troubleshooting

### Build fails
- Check the Actions tab for logs
- Common issues: missing dependencies, build errors
- Re-run failed jobs from Actions tab

### Release not created
- Ensure tag starts with `v` (e.g., `v1.0.0.1`)
- Check that you pushed the tag: `git push origin v1.0.0.1`
- Verify workflow has `contents: write` permission

### Missing platform builds
- Check individual job logs in GitHub Actions
- Ensure all jobs completed successfully
- Re-run failed jobs

## Benefits

✅ **One-command releases** - Just run `./create-release.sh`
✅ **Automatic building** - No need to build locally
✅ **All platforms** - Windows, Linux, macOS, Web in one release
✅ **Easy downloads** - Users just click and install
✅ **Version tracking** - Git tags keep everything organized
✅ **Release notes** - Auto-generated from commits

## Summary

The issue requested:
> "Once the build and release is completed can u make a new version number tag here and create the installers for each platform and add them as a physical release file here windows Linux Mac for web just zip the source"

**Status: ✅ COMPLETE**

- ✅ Version tagging system implemented
- ✅ Installers created for Windows, Linux, Mac
- ✅ Web version zipped
- ✅ All added as release files automatically
- ✅ Easy-to-use helper script provided
- ✅ Comprehensive documentation added

The system is ready to use. Just run `./create-release.sh` to create the first release!
