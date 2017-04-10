import isBuiltinModule from 'is-builtin-module';

const CURRENT_DIRECTORY_PREFIX = './';
const PARENT_DIRECTORY_PREFIX = '../';

export const isExternalModule = path =>
  /^@?\w+/.test(path) && !isBuiltinModule(path);
export const isLocalModuleFromParentDirectory = path =>
  path.startsWith(PARENT_DIRECTORY_PREFIX);
export const isLocalModuleCurrentDirectoryIndex = path =>
  path === CURRENT_DIRECTORY_PREFIX;
export const isLocalModuleFromSiblingDirectory = path =>
  !isLocalModuleCurrentDirectoryIndex(path) &&
  path.startsWith(CURRENT_DIRECTORY_PREFIX);

export const compareByMatch = (match, a, b) => {
  const aIsMatching = match(a);
  if (aIsMatching === match(b)) {
    return null;
  }
  return aIsMatching ? -1 : 1;
};

export default (a, b) => {
  const importTypeMatchFunctions = [
    isBuiltinModule,
    isExternalModule,
    isLocalModuleFromParentDirectory,
    isLocalModuleCurrentDirectoryIndex,
    isLocalModuleFromSiblingDirectory,
  ];

  const result = importTypeMatchFunctions.reduce(
    (acc, match) => {
      return acc === null ? compareByMatch(match, a, b) : acc;
    },
    null,
  );

  return result !== null ? result : a.localeCompare(b);
};
