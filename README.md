# CodeMod to sort ES6 imports by type

Use this codemod to sort ES6 imports by type: external module imports before imports from parent folders before imports from sibling folders. Imports of the same type will be sorted alphabetically.

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
import bar from '../bar';
import './';
import baz from './baz';
import Alpha from 'alpha';
import foo from '../../foo';
import App from './App';
```

After:

```js
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