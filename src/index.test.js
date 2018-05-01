import test from 'ava';
import jscodeshift from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import sortImports from './';

const { testChanged, testUnchanged } = testCodemod(
  jscodeshift,
  test,
  sortImports
);

testChanged(
  'sort imports',
  `import foo from './foo'; import fs from 'fs'; let foo = 'bar';`,
  `import fs from 'fs'; import foo from './foo'; let foo = 'bar';`
);

testChanged(
  `
import bar from '../bar';
import foo from '@foo';
import fooAbc from '@foo/abc';
`,
  `
import foo from '@foo';
import fooAbc from '@foo/abc';
import bar from '../bar';
`
);

testUnchanged(`import foo from '@foo/abc'`);
testUnchanged(`let foo = 'bar';`);
