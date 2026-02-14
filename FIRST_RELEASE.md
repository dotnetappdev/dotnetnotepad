# Creating the First Release

## Why Are Releases Empty?

The GitHub Releases page is currently empty because **no version tags have been created yet**. The release system is fully configured and ready to use, but it only creates releases when you push a Git tag starting with `v`.

## Understanding the Release Process

The automated build system works like this:

1. **You create a version tag** (e.g., `v1.0.0.0`)
2. **GitHub Actions detects the tag** and automatically:
   - Builds the web version (ZIP)
   - Builds Windows installers (NSIS, MSIX, portable EXE)
   - Builds Linux packages (AppImage, DEB)
   - Builds macOS disk image (DMG)
   - Creates a GitHub Release with all files attached

### Why Previous Builds Didn't Create Releases

The GitHub Actions workflow has run successfully before, but those were **manual triggers** (`workflow_dispatch`), not tag-triggered builds. The workflow only creates releases when triggered by a tag push.

## How to Create Your First Release

### Option 1: Use the Release Script (Easiest)

Simply run:

```bash
./create-release.sh
```

The script will:
1. Ask for the new version number
2. Update `package.json`
3. Commit the change
4. Create and push a tag
5. Trigger the automated build and release

### Option 2: Manual Process

```bash
# 1. Update version in package.json
# Change "version": "1.0.0" to "1.0.0.0"

# 2. Commit and push
git add package.json
git commit -m "Bump version to 1.0.0.0"
git push origin main

# 3. Create and push tag
git tag v1.0.0.0
git push origin v1.0.0.0

# 4. Wait for GitHub Actions to complete
```

## After Creating the First Release

Once the first tag is pushed:

1. **Monitor the build**: Go to the Actions tab and watch the progress
2. **Wait for completion**: All 5 jobs (web, windows, linux, macos, release) must complete
3. **Check the release**: Visit the Releases page to see your new release
4. **Download and test**: Test the installers on different platforms

## TypeScript and JavaScript Dependencies

**Good news**: You don't need to worry about TypeScript or JavaScript being installed separately!

### How It Works

- **During development**: TypeScript is used to write the code with type safety
- **During build**: Webpack + ts-loader compiles TypeScript to JavaScript
- **In the final app**: Only JavaScript is included, no TypeScript required
- **All dependencies**: Bundled by webpack into the `dist` folder

### What This Means

When users download and install .NET Notepad:
- ✅ **No TypeScript installation needed**
- ✅ **No JavaScript runtime needed** (Electron includes Node.js)
- ✅ **Everything is bundled** in the installer
- ✅ **Just install and run** - it works out of the box

### MSIX Package Benefits

The new MSIX package format provides:
- ✅ **Modern Windows installation** experience
- ✅ **Automatic updates** (when published to Microsoft Store)
- ✅ **Clean uninstall** - no registry leftovers
- ✅ **Sandboxed execution** for better security
- ✅ **Digital signature** support
- ✅ **Microsoft Store** compatibility (future)

## Summary

- ✅ **Release system is ready** - just needs a tag to trigger it
- ✅ **MSIX installer added** - Windows users get more installation options
- ✅ **TypeScript/JS bundled** - users don't need to install anything extra
- ✅ **Documentation updated** - all files mention the new MSIX option

**Next step**: Run `./create-release.sh` to create version 1.0.0.0 and generate the first release!
