# Blookit
A Node.js module for interacting with the Blooket API written in TypeScript with Node v19. Supports most common API endpoints including login, open pack, sell blook, add rewards, and more. To get started simply install the module and create a new instance of the client class. The client class will handle all of the API requests for you. If you have any questions or need help feel free to join the [Discord](https://discord.gg/D5XP3Bha) server.

## Installation
```bash
npm i blooket.js
```
```bash
yarn add blooket.js
```
```bash
pnpm add blooket.js
```

## Usage
```js
const Blooket = require("blookit");

const credentials = {
    email: "email",
    password: "password"
};

const client = new Blooket.Client(credentials.email, credentials.password);

client.login().then(() => {
    console.log("Logged in!");
});
```

View more examples inside of the ./examples directory.




