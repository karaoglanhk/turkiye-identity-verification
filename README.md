## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 10.0 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install turkiye-identity-verification
```


## Example

```js
const { nativeCitizenVerify, foreignCitizenVerify } = require('turkiye-identity-verification');

// If want native citizen verify
const verifyIdentityForNativeCitizen = async () => {
    try {
        const result = await nativeCitizenVerify(16837259450, 'Hüseyin', 'Karaoğlan', 2000);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};
verifyIdentityForNativeCitizen();



// If want foreign citizen verify
const verifyIdentityForForeignCitizen = async () => {
    try {
        const result = await foreignCitizenVerify(99168372594, 'Hüseyin', 'Karaoğlan', 1, 1, 2000);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};
verifyIdentityForForeignCitizen();