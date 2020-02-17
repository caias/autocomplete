# Otom

input auto-complete library using vanilla javascript (es6)

## Usage

### install

```bash
# npm
npm i Otom

# yarn
yarn add Otom
```

### Usage

*1) Use umd*

html

```html
<script src="/path/to/dist/otom.js"></script>
```

js

```javascript
var otom = new Otom();
otom.init();
```

*2) Use commonjs*

```javascript
const Otom = require('otom');
const otom = new Otom();
otom.init();
```

*3) Use es6*

```javascript
import Otom from 'otom';
const otom = new Otom();
otom.init();
```