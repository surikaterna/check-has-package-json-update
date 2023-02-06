import { Dependencies, PackageJson } from './getPackageJson';

export const getDependencies = (packageJson: PackageJson): Dependencies => {
  const dependencies = packageJson.dependencies ?? {};
  const devDependencies = packageJson.devDependencies ?? {};

  return Object.keys(dependencies)
    .concat(Object.keys(devDependencies))
    .reduce((acc, name) => {
      acc[name] = dependencies[name] || devDependencies[name];
      return acc;
    }, <Dependencies>{});
};
