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
        uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Check has package json update
        uses: surikaterna/check-has-package-json-update@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
