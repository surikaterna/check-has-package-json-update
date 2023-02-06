import { context, getOctokit } from '@actions/github';
import { getPackageJson, PackageJson } from './getPackageJson';

export async function getPreviousPackageJson(token: string): Promise<PackageJson> {
  const octokit = getOctokit(token);
  const commit = await octokit.rest.git.getCommit({ ...context.repo, commit_sha: context.sha });
  const previousRef = commit.data.parents[0].sha;

  return getPackageJson(previousRef, token);
}
