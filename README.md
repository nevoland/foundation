# Foundation

🏛️ Base repository for building JavaScript apps or libraries.

<!-- Delete start -->

> To use this template, clone this repository and rename all "Foundation" instances to the name of your library.
> Set this package to "public" before publishing it.

### Uses

- [Vite](https://vitejs.dev)
- [Vitest](https://vitest.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Prettier](https://prettier.io)
- [Eslint](https://eslint.org)
- [Tailwind](https://tailwindcss.com)
- [Typedoc](https://typedoc.org)
- [NVM](https://github.com/nvm-sh/nvm)

<!-- Delete end -->

## Setup

- `nvm install`
- `cp .env.template .env.local`
- `npm install`

## Library mode

### Features

- List the main features of the library
- Explain how it distinguishes from other libraries

### Usage

Everything is exported from the main entry-point through an ES6 module:

```js
import { add } from "foundation";
```

### Installation

Install with the [Node Package Manager](https://www.npmjs.com/package/foundation):

```bash
npm install foundation
```

### Documentation

Documentation is generated [here](doc/README.md).

### Use the application to test the library

- `npm run dev`
- `npm run dev:test` (or use dedicated Vitest plugin of your IDE)

Import exported library items from the `"#lib"` alias:

```ts
import { add } from "#lib";
```

### Build and publish the library

- `npm run build:lib`
- Set the `private` property to `false` in [package.json](./package.json)
- `npm run release:init`

#### Release subsequent versions using either

- `npm run release:alpha`
- `npm run release:beta`
- `npm run release:patch`
- `npm run release:minor`
- `npm run release:major`

## Application mode

### Develop on the application

- `npm run dev`
- `npm run dev:test` (or use dedicated Vitest plugin of your IDE)

### Build and run

- `npm run build:app`
- OPTIONAL: `export ENV_PATH=path/to/extra/dot_env/file`
- `npm start`

### Options

List all environment variables used by the application:

- `ENV_PATH`: Path to an optional environment file.
- `LOG_LEVEL`: One of the [supported levels](https://github.com/pinojs/pino/blob/main/docs/api.md#loggerlevels-object) or `"silent"` to disable logging.
