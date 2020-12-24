# LDAP

LDAP (Lightweight Directory Access Protocol) is a software protocol for enabling anyone to locate data about organizations, individuals and other resources such as files and devices in a network

## Installation

- You need to use [osixia/openldap](https://github.com/osixia/docker-openldap#quick-start) docker image to have ldap instance locally then need to install [node.js](https://nodejs.org/en/) and run next command in the project directory.

```bash
npm install
```

## Usage
You have many functions which available for you to use

```js
module.exports = {
  createUser,
  readUser,
  updateUser,
  updatePassword,
  deleteUser
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)