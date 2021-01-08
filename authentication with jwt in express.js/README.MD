# Authentication and Authorization with JWTs in Express.js
I implemented this project to perform signin logic and generate a token to validate before use retrieve profile info api.

JSON Web Tokens (JWT) have been introduced as a method of communicating between two parties securely. It was introduced with the RFC 7519 specification by the Internet Engineering Task Force (IETF).
Even though we can use JWT with any type of communication method, today JWT is very popular for handling authentication and authorization via HTTP.

## Installation

```bash
npm install
```
```bash
npm start
```

## Usage
You have many folders which available for your usage:

```js
Config:
Which have configrations value for jwr and response code file
```
```js
middlewares:
Which have auth file to validate value of token
```
```js
model:
Which have models of mongoDB
```
```js
services:
Which have our logic of login and generate token
```
```js
utilities:
Which have mongoDB connection
```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)