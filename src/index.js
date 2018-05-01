import compareImports from './compareImports';

export default (file, api, options) => {
  const config =
    (options && options instanceof Object && options.sortConfig) || {};

  const j = api.jscodeshift;
  const root = j(file.source);

  const declarations = root.find(j.ImportDeclaration);

  if (declarations.length <= 1) {
    return root.toSource();
  }

  const sortedDeclarations = declarations
    .nodes()
    .sort((a, b) =>
      compareImports(b.source.value, a.source.value, config.groups)
    );

  declarations.remove();

  const body = root.get().value.program.body;
  sortedDeclarations.forEach(dec => body.unshift(dec));

  return root.toSource();
};
