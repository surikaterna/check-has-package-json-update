import { context } from '@actions/github';
import { getPackageJson, PackageJson } from './getPackageJson';

export function getCurrentPackageJson(token: string): Promise<PackageJson> {
  const commitSha = context.sha;
  return getPackageJson(commitSha, token);
}
