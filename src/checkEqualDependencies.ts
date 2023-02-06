import { Dependencies } from './getPackageJson';

export function checkEqualDependencies(deps: Dependencies, prevDeps: Dependencies): boolean {
  const depNames = Object.keys(deps);
  const prevDepNames = Object.keys(prevDeps);
  const hasChangedAmount = depNames.length !== prevDepNames.length;
  return !hasChangedAmount && depNames.every((n) => deps[n] === prevDeps[n]);
}
