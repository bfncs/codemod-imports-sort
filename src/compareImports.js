import isBuiltinModule from 'is-builtin-module';

const DEFAULT_ORDER = [
  'builtin',
  'external',
  'internal',
  'parent',
  'sibling',
  'index',
];
const CURRENT_DIRECTORY_PREFIX = './';
const PARENT_DIRECTORY_PREFIX = '../';

const concat = (x, y) => x.concat(y);

export const isExternalModule = path =>
  /^@?[\w-]+$/.test(path) && !isBuiltinModule(path);
export const isInternalModule = path => /^[\w-]+(\/[\w-]+)+$/.test(path);
export const isLocalModuleFromParentDirectory = path =>
  path.startsWith(PARENT_DIRECTORY_PREFIX);
export const isLocalModuleCurrentDirectoryIndex = path =>
  path === CURRENT_DIRECTORY_PREFIX;
export const isLocalModuleFromSiblingDirectory = path =>
  !isLocalModuleCurrentDirectoryIndex(path) &&
  path.startsWith(CURRENT_DIRECTORY_PREFIX);

const matchers = {
  builtin: isBuiltinModule,
  external: isExternalModule,
  internal: isInternalModule,
  parent: isLocalModuleFromParentDirectory,
  index: isLocalModuleCurrentDirectoryIndex,
  sibling: isLocalModuleFromSiblingDirectory,
};
const matcherNames = Object.keys(matchers);

export const compareByMatcher = (matcher, a, b) => {
  const aIsMatching = matcher(a);
  if (aIsMatching === matcher(b)) {
    return null;
  }
  return aIsMatching ? -1 : 1;
};

const isValidSorterName = (name, warn = true) => {
  const isValid = matcherNames.includes(name);
  if (warn && !isValid) {
    console.warn(
      `You used an invalid import sort group: "${name}". Check your configuration.`,
    );
  }
  return isValid;
};

export const sanitizeOrder = order => {
  const bins = order.reduce(
    (acc, item) => {
      if (Array.isArray(item)) {
        const group = item.filter(isValidSorterName).sort();
        if (!group.length) {
          return acc;
        }
        return [...acc, group];
      }
      if (isValidSorterName(item)) {
        return [...acc, item];
      }
      return acc;
    },
    [],
  );
  const usedSorters = bins.reduce(concat, []);
  const omittedSorters = matcherNames.filter(
    name => !usedSorters.includes(name),
  );
  if (omittedSorters.length) {
    bins.push(
      omittedSorters.length === 1 ? omittedSorters[0] : omittedSorters.sort(),
    );
  }
  return bins;
};

export default (a, b, order = DEFAULT_ORDER) => {
  const result = sanitizeOrder(order)
    .map(
      group =>
        Array.isArray(group)
          ? name => (
              group.reduce(
                (acc, matcherName) => (
                  acc === true
                    ? true
                    : matchers[matcherName](name)
                ),
                null,
              )
          )
          : matchers[group],
    )
    .reduce(
      (acc, matcher) => {
        return acc === null ? compareByMatcher(matcher, a, b) : acc;
      },
      null,
    );
  return result !== null ? result : a.localeCompare(b);
};
