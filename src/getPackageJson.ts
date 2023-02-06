import { context, getOctokit } from '@actions/github';

export type Dependencies = Record<string, string>;

export interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
}

export async function getPackageJson(ref: string, token: string): Promise<PackageJson> {
  const octokit = getOctokit(token);
  const contents = await octokit.rest.repos.getContent({ ...context.repo, ref, path: 'package.json' });
  // @ts-expect-error content exists, but OctokitResponse type generic is not exported from @actions/github
  const base64Data = <string | undefined>contents.data.content;

  if (!base64Data) {
    throw new Error(`Could not find package.json for commit ${ref}`);
  }

  const packageJson = <unknown>JSON.parse(Buffer.from(base64Data, 'base64').toString());

  if (!assertPackageJson(packageJson)) {
    throw new Error(`Did not get valid package json data from sha ${ref}`);
  }

  return packageJson;
}

const assertPackageJson = (data: unknown): data is PackageJson => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return 'dependencies' in data || 'devDependencies' in data;
};
