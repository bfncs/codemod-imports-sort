import compareImports from './compareImports';

export default (file, api, options) => {

  const config = options && options instanceof Object
    ? options.sortConfig
    : {};

  const j = api.jscodeshift;
  const root = j(file.source);

  const declarations = root.find(j.ImportDeclaration);
  const sortedDeclarations = declarations
    .nodes()
    .sort((a, b) => compareImports(a.source.value, b.source.value, config.groups));

  declarations.remove();

  return root
    .find(j.Statement)
    .at(0)
    .insertBefore(sortedDeclarations)
    .toSource();
};
