[![Build Status](https://travis-ci.org/bfncs/codemod-imports-sort.svg?branch=master)](https://travis-ci.org/bfncs/codemod-imports-sort)

# CodeMod to sort ES6 imports by type

Use this codemod to sort ES6 imports by type in this order:

* internal Node.js modules before
* external module imports before
* local imports from parent folders before
* local imports from sibling folders.

Imports of the same type are sorted alphabetically.

## Install

```bash
yarn global add codemod-imports-sort
```

## Use

```bash
codemod-imports-sort path/to/file.js
```

## Example

Before:

```js
import './index.css';
import Beta from 'Beta';
import fs from 'fs';
import bar from '../bar';
import './';
import baz from './baz';
import Alpha from 'alpha';
import foo from '../../foo';
import App from './App';
```

After:

```js
import fs from 'fs';
import Alpha from 'alpha';
import Beta from 'Beta';
import foo from '../../foo';
import bar from '../bar';
import './';
import App from './App';
import baz from './baz';
import './index.css';
```

*Built with [jscodeshift](https://github.com/facebook/jscodeshift).*
