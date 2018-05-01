import isBuiltinModule from 'is-builtin-module';
import {
  isExternalModule,
  isScopedExternalModule,
  isInternalModule,
  isLocalModuleFromParentDirectory,
  isLocalModuleCurrentDirectoryIndex,
  isLocalModuleFromSiblingDirectory,
} from './matchers';
import { DEFAULT_ORDER } from './constants';

const concat = (x, y) => x.concat(y);

const matchers = {
  builtin: isBuiltinModule,
  external: isExternalModule,
  'scoped-external': isScopedExternalModule,
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
      `You used an invalid import sort group: "${name}". Check your configuration.`
    );
  }
  return isValid;
};

export const sanitizeOrder = order => {
  const bins = order.reduce((acc, item) => {
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
  }, []);
  const usedSorters = bins.reduce(concat, []);
  const omittedSorters = matcherNames.filter(
    name => !usedSorters.includes(name)
  );
  if (omittedSorters.length) {
    bins.push(
      omittedSorters.length === 1 ? omittedSorters[0] : omittedSorters.sort()
    );
  }
  return bins;
};

export default (a, b, order = DEFAULT_ORDER) => {
  const result = sanitizeOrder(order)
    .map(
      group =>
        Array.isArray(group)
          ? name =>
              group.reduce(
                (acc, matcherName) =>
                  acc === true ? true : matchers[matcherName](name),
                null
              )
          : matchers[group]
    )
    .reduce((acc, matcher) => {
      return acc === null ? compareByMatcher(matcher, a, b) : acc;
    }, null);
  return result !== null ? result : a.localeCompare(b);
};
