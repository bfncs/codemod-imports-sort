import test from 'ava';
import compareImports, {
  sanitizeOrder,
  isExternalModule,
  isInternalModule,
  isLocalModuleFromParentDirectory,
  isLocalModuleCurrentDirectoryIndex,
  isLocalModuleFromSiblingDirectory,
  compareByMatcher,
} from './compareImports';

const DEFAULT_ORDER = [
  'builtin',
  'external',
  'internal',
  'parent',
  'sibling',
  'index',
];

test('sanitizeOrder should leave default order unchanged', t => {
  t.deepEqual(sanitizeOrder(DEFAULT_ORDER), DEFAULT_ORDER);
});

test('sanitizeOrder should append all omitted groups', t => {
  t.deepEqual(sanitizeOrder(['external']), [
    'external',
    ['builtin', 'internal', 'parent', 'sibling', 'index'].sort(),
  ]);
  t.deepEqual(
    sanitizeOrder(['builtin', ['internal', 'parent', 'sibling', 'index']]),
    ['builtin', ['internal', 'parent', 'sibling', 'index'].sort(), 'external'],
  );
});

const BUILTIN_MODULE_A = 'fs';
const BUILTIN_MODULE_B = 'http';
const EXTERNAL_MODULE_A = 'alpha-module';
const EXTERNAL_MODULE_B = 'beta-module';
const EXTERNAL_SCOPED_MODULE = '@omega';
const INTERNAL_MODULE_A = 'src/foo';
const INTERNAL_MODULE_B = 'src/foo/bar/baz';
const LOCAL_PARENT_MODULE_A = '../delta';
const LOCAL_PARENT_MODULE_B = '../gamma';
const LOCAL_INDEX_MODULE = './';
const LOCAL_SIBLING_MODULE_A = './epsilon';
const LOCAL_SIBLING_MODULE_B = './zeta/eta';

const FIRST = -1;
const SECOND = 1;

test('isExternalModule is true only for external modules', t => {
  t.false(isExternalModule(BUILTIN_MODULE_A));
  t.false(isExternalModule(BUILTIN_MODULE_B));
  t.true(isExternalModule(EXTERNAL_MODULE_A));
  t.true(isExternalModule(EXTERNAL_MODULE_B));
  t.true(isExternalModule(EXTERNAL_SCOPED_MODULE));
  t.false(isExternalModule(INTERNAL_MODULE_A));
  t.false(isExternalModule(INTERNAL_MODULE_B));
  t.false(isExternalModule(LOCAL_PARENT_MODULE_A));
  t.false(isExternalModule(LOCAL_PARENT_MODULE_B));
  t.false(isExternalModule(LOCAL_INDEX_MODULE));
  t.false(isExternalModule(LOCAL_SIBLING_MODULE_A));
  t.false(isExternalModule(LOCAL_SIBLING_MODULE_B));
});

test('isInternalModule is true only for internal modules', t => {
  t.false(isInternalModule(BUILTIN_MODULE_A));
  t.false(isInternalModule(BUILTIN_MODULE_B));
  t.false(isInternalModule(EXTERNAL_MODULE_A));
  t.false(isInternalModule(EXTERNAL_MODULE_B));
  t.false(isInternalModule(EXTERNAL_SCOPED_MODULE));
  t.true(isInternalModule(INTERNAL_MODULE_A));
  t.true(isInternalModule(INTERNAL_MODULE_B));
  t.false(isInternalModule(LOCAL_PARENT_MODULE_A));
  t.false(isInternalModule(LOCAL_PARENT_MODULE_B));
  t.false(isInternalModule(LOCAL_INDEX_MODULE));
  t.false(isInternalModule(LOCAL_SIBLING_MODULE_A));
  t.false(isInternalModule(LOCAL_SIBLING_MODULE_B));
});

test('isLocalModuleFromParentDirectory is true only for local parent modules', t => {
  t.false(isLocalModuleFromParentDirectory(BUILTIN_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(BUILTIN_MODULE_B));
  t.false(isLocalModuleFromParentDirectory(EXTERNAL_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(EXTERNAL_MODULE_B));
  t.false(isLocalModuleFromParentDirectory(EXTERNAL_SCOPED_MODULE));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_B));
  t.true(isLocalModuleFromParentDirectory(LOCAL_PARENT_MODULE_A));
  t.true(isLocalModuleFromParentDirectory(LOCAL_PARENT_MODULE_B));
  t.false(isLocalModuleFromParentDirectory(LOCAL_INDEX_MODULE));
  t.false(isLocalModuleFromParentDirectory(LOCAL_SIBLING_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(LOCAL_SIBLING_MODULE_B));
});

test('isLocalModuleCurrentDirectoryIndex is true only for current directory index module', t => {
  t.false(isLocalModuleCurrentDirectoryIndex(BUILTIN_MODULE_A));
  t.false(isLocalModuleCurrentDirectoryIndex(BUILTIN_MODULE_B));
  t.false(isLocalModuleCurrentDirectoryIndex(EXTERNAL_MODULE_A));
  t.false(isLocalModuleCurrentDirectoryIndex(EXTERNAL_MODULE_B));
  t.false(isLocalModuleCurrentDirectoryIndex(EXTERNAL_SCOPED_MODULE));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_B));
  t.false(isLocalModuleCurrentDirectoryIndex(LOCAL_PARENT_MODULE_A));
  t.false(isLocalModuleCurrentDirectoryIndex(LOCAL_PARENT_MODULE_B));
  t.true(isLocalModuleCurrentDirectoryIndex(LOCAL_INDEX_MODULE));
  t.false(isLocalModuleCurrentDirectoryIndex(LOCAL_SIBLING_MODULE_A));
  t.false(isLocalModuleCurrentDirectoryIndex(LOCAL_SIBLING_MODULE_B));
});

test('isLocalModuleFromSiblingDirectory is true only for current directory index module', t => {
  t.false(isLocalModuleFromSiblingDirectory(BUILTIN_MODULE_A));
  t.false(isLocalModuleFromSiblingDirectory(BUILTIN_MODULE_B));
  t.false(isLocalModuleFromSiblingDirectory(EXTERNAL_MODULE_A));
  t.false(isLocalModuleFromSiblingDirectory(EXTERNAL_MODULE_B));
  t.false(isLocalModuleFromSiblingDirectory(EXTERNAL_SCOPED_MODULE));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_B));
  t.false(isLocalModuleFromSiblingDirectory(LOCAL_PARENT_MODULE_A));
  t.false(isLocalModuleFromSiblingDirectory(LOCAL_PARENT_MODULE_B));
  t.false(isLocalModuleFromSiblingDirectory(LOCAL_INDEX_MODULE));
  t.true(isLocalModuleFromSiblingDirectory(LOCAL_SIBLING_MODULE_A));
  t.true(isLocalModuleFromSiblingDirectory(LOCAL_SIBLING_MODULE_B));
});

const matchIfIsA = test => test === 'a';

test('compareByMatcher favors matching', t => {
  t.is(compareByMatcher(matchIfIsA, 'a', 'b'), FIRST);
  t.is(compareByMatcher(matchIfIsA, 'b', 'a'), SECOND);
});

test('compareByMatcher returns null if none is matching', t => {
  t.is(compareByMatcher(matchIfIsA, 'b', 'c'), null);
});

test('compareByMatcher returns null if both are matching', t => {
  t.is(compareByMatcher(matchIfIsA, 'a', 'a'), null);
});

test('compareImports favors builtin modules before all others', t => {
  t.is(compareImports(BUILTIN_MODULE_A, EXTERNAL_MODULE_A), FIRST);
  t.is(compareImports(EXTERNAL_MODULE_A, BUILTIN_MODULE_A), SECOND);
  t.is(compareImports(BUILTIN_MODULE_A, EXTERNAL_SCOPED_MODULE), FIRST);
  t.is(compareImports(EXTERNAL_SCOPED_MODULE, BUILTIN_MODULE_A), SECOND);
  t.is(compareImports(BUILTIN_MODULE_A, INTERNAL_MODULE_A), FIRST);
  t.is(compareImports(INTERNAL_MODULE_A, BUILTIN_MODULE_A), SECOND);
  t.is(compareImports(BUILTIN_MODULE_A, LOCAL_PARENT_MODULE_A), FIRST);
  t.is(compareImports(LOCAL_PARENT_MODULE_A, BUILTIN_MODULE_A), SECOND);
  t.is(compareImports(BUILTIN_MODULE_A, LOCAL_INDEX_MODULE), FIRST);
  t.is(compareImports(LOCAL_INDEX_MODULE, BUILTIN_MODULE_A), SECOND);
  t.is(compareImports(BUILTIN_MODULE_A, LOCAL_SIBLING_MODULE_A), FIRST);
  t.is(compareImports(LOCAL_SIBLING_MODULE_A, BUILTIN_MODULE_A), SECOND);
});

test('compareImports favors external modules before internal & local modules', t => {
  t.is(compareImports(EXTERNAL_MODULE_A, LOCAL_PARENT_MODULE_A), FIRST);
  t.is(compareImports(LOCAL_PARENT_MODULE_A, EXTERNAL_MODULE_A), SECOND);
  t.is(compareImports(EXTERNAL_SCOPED_MODULE, LOCAL_PARENT_MODULE_A), FIRST);
  t.is(compareImports(LOCAL_PARENT_MODULE_A, EXTERNAL_SCOPED_MODULE), SECOND);
  t.is(compareImports(EXTERNAL_MODULE_A, INTERNAL_MODULE_A), FIRST);
  t.is(compareImports(INTERNAL_MODULE_A, EXTERNAL_MODULE_A), SECOND);
  t.is(compareImports(EXTERNAL_MODULE_A, LOCAL_INDEX_MODULE), FIRST);
  t.is(compareImports(LOCAL_INDEX_MODULE, EXTERNAL_MODULE_A), SECOND);
  t.is(compareImports(EXTERNAL_MODULE_A, LOCAL_SIBLING_MODULE_A), FIRST);
  t.is(compareImports(LOCAL_SIBLING_MODULE_A, EXTERNAL_MODULE_A), SECOND);
});

test('compareImports favors internal modules before local modules', t => {
  t.is(compareImports(INTERNAL_MODULE_A, LOCAL_PARENT_MODULE_A), FIRST);
  t.is(compareImports(LOCAL_PARENT_MODULE_A, INTERNAL_MODULE_A), SECOND);
  t.is(compareImports(INTERNAL_MODULE_A, LOCAL_INDEX_MODULE), FIRST);
  t.is(compareImports(LOCAL_INDEX_MODULE, INTERNAL_MODULE_A), SECOND);
  t.is(compareImports(INTERNAL_MODULE_A, LOCAL_SIBLING_MODULE_A), FIRST);
  t.is(compareImports(LOCAL_SIBLING_MODULE_A, INTERNAL_MODULE_A), SECOND);
});

test('compareImports favors parent dir modules before other local modules', t => {
  t.is(compareImports(LOCAL_PARENT_MODULE_A, LOCAL_INDEX_MODULE), FIRST);
  t.is(compareImports(LOCAL_INDEX_MODULE, LOCAL_PARENT_MODULE_A), SECOND);
  t.is(compareImports(LOCAL_PARENT_MODULE_A, LOCAL_SIBLING_MODULE_A), FIRST);
  t.is(compareImports(LOCAL_SIBLING_MODULE_A, LOCAL_PARENT_MODULE_A), SECOND);
});

test('compareImports favors sibling modules before local index modules', t => {
  t.is(compareImports(LOCAL_SIBLING_MODULE_A, LOCAL_INDEX_MODULE), FIRST);
  t.is(compareImports(LOCAL_INDEX_MODULE, LOCAL_SIBLING_MODULE_A), SECOND);
});

test('compareImports sorts imports of the same type alphabetically', t => {
  t.is(compareImports(BUILTIN_MODULE_A, BUILTIN_MODULE_B), FIRST);
  t.is(compareImports(BUILTIN_MODULE_B, BUILTIN_MODULE_A), SECOND);
  t.is(compareImports(LOCAL_PARENT_MODULE_A, LOCAL_PARENT_MODULE_B), FIRST);
  t.is(compareImports(LOCAL_PARENT_MODULE_B, LOCAL_PARENT_MODULE_A), SECOND);
  t.is(compareImports(LOCAL_SIBLING_MODULE_A, LOCAL_SIBLING_MODULE_B), FIRST);
  t.is(compareImports(LOCAL_SIBLING_MODULE_B, LOCAL_SIBLING_MODULE_A), SECOND);
});
