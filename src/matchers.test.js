import test from 'ava';
import {
  isExternalModule,
  isInternalModule,
  isLocalModuleFromParentDirectory,
  isLocalModuleCurrentDirectoryIndex,
  isLocalModuleFromSiblingDirectory,
} from './matchers';

const BUILTIN_MODULE_A = 'fs';
const BUILTIN_MODULE_B = 'http';
const EXTERNAL_MODULE_A = 'alpha-module';
const EXTERNAL_MODULE_B = 'beta-module';
const EXTERNAL_SCOPED_MODULE = '@omega';
const VALID_EXTERNAL_SCOPED_MODULE_WITH_SLASH = '@foo/abc';
const INVALID_EXTERNAL_SCOPED_MODULE_WITH_SLASHES = '@foo/////abc';
const INTERNAL_MODULE_A = 'src/foo';
const INTERNAL_MODULE_B = 'src/foo/bar/baz';
const LOCAL_PARENT_MODULE_A = '../delta';
const LOCAL_PARENT_MODULE_B = '../gamma';
const LOCAL_INDEX_MODULE = './';
const LOCAL_SIBLING_MODULE_A = './epsilon';
const LOCAL_SIBLING_MODULE_B = './zeta/eta';

test('isExternalModule is true only for external modules', t => {
  t.false(isExternalModule(BUILTIN_MODULE_A));
  t.false(isExternalModule(BUILTIN_MODULE_B));
  t.false(isExternalModule(EXTERNAL_SCOPED_MODULE));
  t.false(isExternalModule(INTERNAL_MODULE_A));
  t.false(isExternalModule(INTERNAL_MODULE_B));
  t.false(isExternalModule(INVALID_EXTERNAL_SCOPED_MODULE_WITH_SLASHES));
  t.false(isExternalModule(LOCAL_INDEX_MODULE));
  t.false(isExternalModule(LOCAL_PARENT_MODULE_A));
  t.false(isExternalModule(LOCAL_PARENT_MODULE_B));
  t.false(isExternalModule(LOCAL_SIBLING_MODULE_A));
  t.false(isExternalModule(LOCAL_SIBLING_MODULE_B));
  t.false(isExternalModule(VALID_EXTERNAL_SCOPED_MODULE_WITH_SLASH));
  t.true(isExternalModule(EXTERNAL_MODULE_A));
  t.true(isExternalModule(EXTERNAL_MODULE_B));
});

test('isInternalModule is true only for internal modules', t => {
  t.false(isInternalModule(BUILTIN_MODULE_A));
  t.false(isInternalModule(BUILTIN_MODULE_B));
  t.false(isInternalModule(EXTERNAL_MODULE_A));
  t.false(isInternalModule(EXTERNAL_MODULE_B));
  t.false(isInternalModule(EXTERNAL_SCOPED_MODULE));
  t.false(isInternalModule(INVALID_EXTERNAL_SCOPED_MODULE_WITH_SLASHES));
  t.false(isInternalModule(LOCAL_INDEX_MODULE));
  t.false(isInternalModule(LOCAL_PARENT_MODULE_A));
  t.false(isInternalModule(LOCAL_PARENT_MODULE_B));
  t.false(isInternalModule(LOCAL_SIBLING_MODULE_A));
  t.false(isInternalModule(LOCAL_SIBLING_MODULE_B));
  t.false(isInternalModule(VALID_EXTERNAL_SCOPED_MODULE_WITH_SLASH));
  t.true(isInternalModule(INTERNAL_MODULE_A));
  t.true(isInternalModule(INTERNAL_MODULE_B));
});

test('isLocalModuleFromParentDirectory is true only for local parent modules', t => {
  t.false(isLocalModuleFromParentDirectory(BUILTIN_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(BUILTIN_MODULE_B));
  t.false(isLocalModuleFromParentDirectory(EXTERNAL_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(EXTERNAL_MODULE_B));
  t.false(isLocalModuleFromParentDirectory(EXTERNAL_SCOPED_MODULE));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_B));
  t.false(
    isLocalModuleFromParentDirectory(
      INVALID_EXTERNAL_SCOPED_MODULE_WITH_SLASHES
    )
  );
  t.false(isLocalModuleFromParentDirectory(LOCAL_INDEX_MODULE));
  t.false(isLocalModuleFromParentDirectory(LOCAL_SIBLING_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(LOCAL_SIBLING_MODULE_B));
  t.false(
    isLocalModuleFromParentDirectory(VALID_EXTERNAL_SCOPED_MODULE_WITH_SLASH)
  );
  t.true(isLocalModuleFromParentDirectory(LOCAL_PARENT_MODULE_A));
  t.true(isLocalModuleFromParentDirectory(LOCAL_PARENT_MODULE_B));
});

test('isLocalModuleCurrentDirectoryIndex is true only for current directory index module', t => {
  t.false(isLocalModuleCurrentDirectoryIndex(BUILTIN_MODULE_A));
  t.false(isLocalModuleCurrentDirectoryIndex(BUILTIN_MODULE_B));
  t.false(isLocalModuleCurrentDirectoryIndex(EXTERNAL_MODULE_A));
  t.false(isLocalModuleCurrentDirectoryIndex(EXTERNAL_MODULE_B));
  t.false(isLocalModuleCurrentDirectoryIndex(EXTERNAL_SCOPED_MODULE));
  t.false(
    isLocalModuleCurrentDirectoryIndex(
      INVALID_EXTERNAL_SCOPED_MODULE_WITH_SLASHES
    )
  );
  t.false(isLocalModuleCurrentDirectoryIndex(LOCAL_PARENT_MODULE_A));
  t.false(isLocalModuleCurrentDirectoryIndex(LOCAL_PARENT_MODULE_B));
  t.false(isLocalModuleCurrentDirectoryIndex(LOCAL_SIBLING_MODULE_A));
  t.false(isLocalModuleCurrentDirectoryIndex(LOCAL_SIBLING_MODULE_B));
  t.false(
    isLocalModuleCurrentDirectoryIndex(VALID_EXTERNAL_SCOPED_MODULE_WITH_SLASH)
  );
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_B));
  t.true(isLocalModuleCurrentDirectoryIndex(LOCAL_INDEX_MODULE));
});

test('isLocalModuleFromSiblingDirectory is true only for current directory index module', t => {
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_A));
  t.false(isLocalModuleFromParentDirectory(INTERNAL_MODULE_B));
  t.false(isLocalModuleFromSiblingDirectory(BUILTIN_MODULE_A));
  t.false(isLocalModuleFromSiblingDirectory(BUILTIN_MODULE_B));
  t.false(isLocalModuleFromSiblingDirectory(EXTERNAL_MODULE_A));
  t.false(isLocalModuleFromSiblingDirectory(EXTERNAL_MODULE_B));
  t.false(isLocalModuleFromSiblingDirectory(EXTERNAL_SCOPED_MODULE));
  t.false(
    isLocalModuleFromSiblingDirectory(
      INVALID_EXTERNAL_SCOPED_MODULE_WITH_SLASHES
    )
  );
  t.false(isLocalModuleFromSiblingDirectory(LOCAL_INDEX_MODULE));
  t.false(isLocalModuleFromSiblingDirectory(LOCAL_PARENT_MODULE_A));
  t.false(isLocalModuleFromSiblingDirectory(LOCAL_PARENT_MODULE_B));
  t.false(
    isLocalModuleFromSiblingDirectory(VALID_EXTERNAL_SCOPED_MODULE_WITH_SLASH)
  );
  t.true(isLocalModuleFromSiblingDirectory(LOCAL_SIBLING_MODULE_A));
  t.true(isLocalModuleFromSiblingDirectory(LOCAL_SIBLING_MODULE_B));
});
