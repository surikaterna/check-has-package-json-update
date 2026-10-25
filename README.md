Check Has Package Json Update
=============================

Action to check whether the package.json dependencies or devDependencies were updated in the last commit. Outputs three variables:

* has-updated: Whether there was a difference in the current and previous dependencies
* dependencies: The combined dependencies and devDependencies for the last commit
* previous-dependencies: The combined dependencies and devDependencies before the commit

# Workflow

* Get package.json for the repo before and after the last commit
* Get the combined dependencies and devDependencies for the two package.json files
* Check if the dependencies have been changes in the last commit

# Usage

Add the following workflow to GitHub Actions to trigger on created and updated pull requests:

```yml
on:
  pull_request:
    types: [opened, edited, synchronize]
    branches:
      - develop

jobs:
  check_has_package_json_update:
    runs-on: ubuntu-latest
    name: Check Has Package JSON Update
    steps:
      - name: Checkout
        uses: actions/checkout@v6
      - name: Setup Node
        uses: actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38 # v6
        with:
          node-version: '22.23.4'
          package-manager-cache: false
      - name: Check has package json update
        uses: surikaterna/check-has-package-json-update@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

# Runtime security and compatibility

For CVE-2026-111497, this composite action installs **Node.js 22.23.4** with
commit-pinned `actions/setup-node` and runs the existing `lib/index.js` bundle.
The token input and all three outputs (`has-updated`, `dependencies` and
`previous-dependencies`) are preserved. HTTP decompression remains enabled.
No application code or dependencies changed, so no bundle rebuild is needed.

Use GitHub Actions runner **2.338.1 or newer with patched embedded Node.js**:
[runner 2.338.1](https://github.com/actions/runner/releases/tag/v2.338.1)
[ships Node.js 24.22.1](https://github.com/actions/runner/blob/v2.338.1/src/Misc/externals.sh)
for the setup-node bootstrap. `runs.using: node24` alone does not select a patch.
Linux, macOS and Windows remain supported where Node.js 22 and Bash are available
(Windows uses Git Bash); this is not a Docker/Linux-only action.
The setup step adds Node.js 22.23.4 to the job's **PATH for subsequent steps**;
run setup-node again afterwards if another runtime is needed.

After merging, select a commit/tag containing this fix; old release tags do not
change. The example uses `main`; production workflows should pin the fixed commit.
Direct development requires `^22.23.4 || ^24.22.1 || >=26.12.1`. Update self-hosted
runners and rerun workflows to activate the fix; no deployment was performed.
See the [Node.js security release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).

Targeted Linux smoke: the unchanged bundle ran through the manifest's Bash command
on Node.js 22.23.4 against local Brotli-encoded GitHub API fixtures. Current/previous
package retrieval, token forwarding and all output mappings passed. Hosted Actions
and Windows/macOS were not exercised; no exploit payloads or full suite were run.
