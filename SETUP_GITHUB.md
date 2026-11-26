# Building & Releasing Python Visual Lab for Windows (Using GitHub)

You do **not** need to install Node.js, Electron, or any build tools on your own Windows computer. Every time you trigger a build or publish a version tag, **GitHub Actions** automatically builds both Windows `.exe` files on a cloud Windows machine and attaches them to a **GitHub Release** ready for you to download and share.

The two files built for every release are:
- **`PythonVisualLab-Setup-<version>.exe`** — Standard Windows installer (adds Start Menu & Desktop shortcuts, easy uninstall via Windows Settings).
- **`PythonVisualLab-Portable-<version>.exe`** — Single standalone app file you can run directly without installing (great for USB drives or restricted PCs).

---

## Step 1 — One-Time GitHub Repository Setup

Before running your first Windows build, grant GitHub Actions permission to attach `.exe` files to your Releases:

1. Open your repository page on **GitHub.com**.
2. In the top repository menu bar, click **Settings** (far right tab with a gear icon).
3. In the left sidebar, expand **Actions**, then click **General**.
4. Scroll down to the **Workflow permissions** section.
5. Select **Read and write permissions**.
6. *(Optional)* Leave **Allow GitHub Actions to create and approve pull requests** unchecked.
7. Click **Save** at the bottom of that section.

> **Optional — Custom App Icon:** A clean Python Visual Lab desktop icon (`256x256` multi-size `.ico`) is already included at `build/icon.ico`. To use your own custom logo later, open the `build` folder in your repository on **GitHub.com**, click **Add file > Upload files**, upload your `build/icon.ico` (and `build/icon.png` for 512×512 PNG) keeping the exact same filenames, and click **Commit changes**.

> **Optional — Automatic In-App Update Notices:** Every `.exe` built by GitHub Actions automatically embeds your GitHub repository link so the desktop app can quietly check for new releases when online (and stays completely silent when offline). No manual file editing is required.

---

## Step 2 — Option A: Start a Build Manually from the Actions Tab

Use this method anytime you want GitHub to build a specific version number (even without creating a tag beforehand):

1. Open your repository on **GitHub.com**.
2. Click the **Actions** tab in the top repository menu.
3. In the left sidebar under **All workflows**, click **Build & Release Windows Desktop App**.
4. Above the list of workflow runs on the right, click the **Run workflow** dropdown button.
5. In the **App release version (e.g. 2.0.0 or v2.0.0)** box, type a semantic version number such as `2.0.0` (or `2.0.1`, `2.1.0`).
6. Click the green **Run workflow** button.
7. Refresh the page after a few seconds — you will see a yellow spinning dot next to your new workflow run. Wait roughly **4–7 minutes** for the dot to turn into a green checkmark (✅).

When it finishes, GitHub creates (or updates) a Release tagged `v<version>` (for example `v2.0.0`) with both `.exe` files attached.

---

## Step 3 — Option B: Publish a New Version from the Releases Page

Use this method when publishing a formal version from your repository's **Releases** page:

1. Open your repository's main **Code** page on **GitHub.com**.
2. Look at the right-hand sidebar and click **Releases** (or click **Create a new release** if no releases exist yet).
3. Click the **Draft a new release** button near the top right.
4. Click **Choose a tag**.
5. Type a new version tag starting with **`v`**, for example `v2.1.0`, then click **Create new tag: v2.1.0 on publish**.
6. Enter a **Release title** (for example `Python Visual Lab v2.1.0`) and optional release notes.
7. Click the green **Publish release** button.
8. Publishing the `v*` tag automatically starts the **Build & Release Windows Desktop App** workflow in the **Actions** tab. Wait **4–7 minutes** for the build to complete and attach the `.exe` files to that same release page.

---

## Step 4 — Where to Download the Installer

Once the workflow shows a green checkmark (✅), you can download the Windows `.exe` files from either place:

### From the Releases Page (Best for Sharing)
1. Go to your repository on **GitHub.com** and click **Releases** on the right-hand sidebar.
2. Scroll to the latest release (for example `Python Visual Lab v2.0.0`) and expand **Assets** at the bottom of the release card.
3. Click either:
   - `PythonVisualLab-Setup-2.0.0.exe` (for normal Windows installation)
   - `PythonVisualLab-Portable-2.0.0.exe` (to run directly without installing)
4. You can copy and share this Releases page link with anyone — they do not need a GitHub account to download public releases.

### From the Actions Run (Artefacts Backup)
1. Open the **Actions** tab and click your finished workflow run.
2. Scroll down to the **Artifacts** section at the bottom of the summary page.
3. Click **`PythonVisualLab-Windows-<version>`** to download a `.zip` file containing both `.exe` files (extract the `.zip` before running).

---

## Step 5 — Installing on Windows (Bypassing Windows SmartScreen)

Because these `.exe` files are **unsigned** (they do not use a paid commercial code-signing certificate yet), Windows Defender SmartScreen shows a standard warning on first run for newly published community apps:

1. Double-click the downloaded `PythonVisualLab-Setup-<version>.exe` (or `PythonVisualLab-Portable-<version>.exe`).
2. If a blue popup appears saying **"Windows protected your PC — Microsoft Defender SmartScreen prevented an unrecognized app from starting"**:
   - Click the underlined **`More info`** link right below the first paragraph.
   - A new **`Run anyway`** button will appear at the bottom right. Click **`Run anyway`**.
3. Follow the installer prompts (or if using the Portable version, wait a few seconds for Python Visual Lab to open).
4. Once installed, Python Visual Lab runs **100% offline** — including all 30 days of interactive lessons, visual simulations, code playground, PDF certificate export, and the built-in Python engine.

*(Future note: If you purchase a Windows code-signing certificate later, add two repository secrets on GitHub.com under **Settings > Secrets and variables > Actions**: `CSC_LINK` and `CSC_KEY_PASSWORD`. The workflow is already wired to detect and apply them automatically.)*

---

## Step 6 — How to Read a Failed Log & Common Error Fixes

If a workflow run fails and shows a red **❌**:

1. Click the **Actions** tab and click the failed run name.
2. Under **Jobs**, click **`Build Windows x64 (.exe Installer & Portable)`**.
3. Look for the step with a red **❌** next to it and click it to expand the log output.
4. Scroll to the **last 10–20 lines** of that step (usually marked `Error:` in red).

### Common Errors & Solutions

| Error Message in Log | What It Means | How to Fix It |
| --- | --- | --- |
| **`Resource not accessible by integration`** or **`403 Forbidden`** during the Release step | GitHub Actions does not have permission to create Releases or upload `.exe` files. | Repeat **Step 1**: open **Settings > Actions > General > Workflow permissions**, choose **Read and write permissions**, click **Save**, then click **Re-run all jobs** on the failed run. |
| **`npm ci` fails: lock file out of sync / missing `package-lock.json`** | `package.json` was changed directly without updating `package-lock.json`. | Avoid editing `package.json` manually on GitHub.com; re-sync from Google AI Studio (which includes a matched `package-lock.json`) and re-run the workflow. |
| **`Invalid version '...'`** in the Resolve version step | The tag or manual version input did not match `X.Y.Z` (e.g. `2.0.0` or `v2.0.0`). | Re-run with a clean three-part version number like `2.0.0` or `2.1.3` (no spaces or extra words). |
| **`Missing expected installer` / `build/icon.ico` error** | `build/icon.ico` was excluded or replaced with an invalid file. | Re-sync from Google AI Studio or upload a valid 256×256 `.ico` file into `build/icon.ico` on GitHub.com. |
| **`Cannot clean release/...` or `ENOSPC` / temporary runner failure** | Transient Windows runner glitch on GitHub's side. | Click **Re-run failed jobs** in the top right of the failed Actions run page. |
| **`422 Unprocessable Entity` / release tag conflict** | A Draft or immutable release with the exact same tag blocked updates. | Delete the broken draft tag on the **Releases** page, or bump to the next patch version (e.g., `v2.0.1`). |
