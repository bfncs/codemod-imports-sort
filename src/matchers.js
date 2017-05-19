import isBuiltinModule from 'is-builtin-module';

const CURRENT_DIRECTORY_PREFIX = './';
const PARENT_DIRECTORY_PREFIX = '../';

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
