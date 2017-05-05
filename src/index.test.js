import test from 'ava';
import jscodeshift from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import sortImports from './';

const { testChanged, testUnchanged } = testCodemod(
  jscodeshift,
  test,
  sortImports,
);

testChanged(
  'sort imports',
  `import foo from './foo'; import fs from 'fs'; let foo = 'bar';`,
  `import fs from 'fs'; import foo from './foo'; let foo = 'bar';`,
);

testUnchanged(`let foo = 'bar';`);
