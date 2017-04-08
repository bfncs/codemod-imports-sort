import isBuiltinModule from 'is-builtin-module';

const CURRENT_DIRECTORY_PREFIX = './';
const PARENT_DIRECTORY_PREFIX = '../';

const compareByMatch = (match, a, b) => {
  const aIsMatching = match(a);
  if (aIsMatching === match(b)) {
    return null;
  }
  return aIsMatching ? -1 : 1;
};

const compareImports = (a, b) => {
  const aSrc = a.source.value;
  const bSrc = b.source.value;

  const importTypeMatchFunctions = [
    isBuiltinModule,
    (path) => (/^\w+/.test(path)),
    (path) => (path.startsWith(PARENT_DIRECTORY_PREFIX)),
    (path) => (path === CURRENT_DIRECTORY_PREFIX),
    (path) => (path.startsWith(CURRENT_DIRECTORY_PREFIX)),
  ];

  const result = importTypeMatchFunctions.reduce(
    (acc, match) => {
      return (acc === null)
        ? compareByMatch(match, aSrc, bSrc)
        : acc;
    },
    null
  );

  return result !== null
    ? result
    : aSrc.localeCompare(bSrc);
};

export default (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const declarations = root.find(j.ImportDeclaration);
  const sortedDeclarations = declarations.nodes().sort(compareImports);

  declarations.remove();

  return root
    .find(j.Statement)
    .at(0)
    .insertBefore(sortedDeclarations)
    .toSource();
}
