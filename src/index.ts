import * as core from '@actions/core';
import { checkEqualDependencies } from './checkEqualDependencies';
import { getCurrentPackageJson } from './getCurrentPackageJson';
import { getDependencies } from './getDependencies';
import { getPreviousPackageJson } from './getPreviousPackageJson';

async function run(): Promise<void> {
  try {
    const token = core.getInput('token');

    if (!token) {
      throw new Error('Missing GitHub Secret Token, cannot check changes');
    }

    const currentPackageJson = await getCurrentPackageJson(token);
    const previousPackageJson = await getPreviousPackageJson(token);

    const dependencies = getDependencies(currentPackageJson);
    const previousDependencies = getDependencies(previousPackageJson);
    const hasEqualDependencies = checkEqualDependencies(dependencies, previousDependencies);

    core.setOutput('has-updated', !hasEqualDependencies);
    core.setOutput('previous-dependencies', previousDependencies);
    core.setOutput('dependencies', dependencies);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run().catch(() => {
  // Noop
});
