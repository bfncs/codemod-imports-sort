import compareImports from './compareImports';

export default (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const declarations = root.find(j.ImportDeclaration);
  const sortedDeclarations = declarations
    .nodes()
    .sort((a, b) => compareImports(a.source.value, b.source.value));

  declarations.remove();

  return root
    .find(j.Statement)
    .at(0)
    .insertBefore(sortedDeclarations)
    .toSource();
};
