const moment = require('moment');
const {
    v4,
    uuid
} = require('uuid');
const ldap = require('ldapjs');
const Promise = require('bluebird');
const config = require('./config');

module.exports = class LDAP {
    constructor() {
        this.protocol = config.LDAP.protocol;
        this.host = config.LDAP.host;
        this.port = config.LDAP.port;
        this.password = config.LDAP.password;
        this.domain = config.LDAP.domain;
        this.createClient();
    }
    async createClient() {
        if (this.client) return this.client;

        const url = `${this.protocol}://${this.host}:${this.port}`;
        const tlsOptions = {
            rejectUnauthorized: false
        };
        this.client = await ldap.createClient({
            url,
            tlsOptions
        });
        console.log({
            client: this.client
        });
        this.client.on('error', (err) => {
            console.log({
                errorEvent: err
            });
            throw defaultErrorHandler(err, events.LdapConnectionError(url), null, DatabaseError);
        });
        console.log({
            message: `Client created with config: {
              protocol: ${this.protocol},
              host: ${this.host},
              port: ${this.port},
              domain: ${this.domain},
            }`
        });
        return this.client;
    }

    async unbind() {
        return this.client.unbind(err => err);
    }

    async bind() {
        try {
            console.log({
                message: `Binding to ldap on ${this.host}:${this.port} as ${this.user}`
            });
            const binding = await new Promise((resolve, reject) => this.client
                .bind(this.user, this.password, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }));
            console.log({
                message: `Bound to ldap on ${this.host}:${this.port} as ${this.user}`
            });
            return binding;
        } catch (err) {
            throw defaultErrorHandler(err, events.LdapBindError(this.user), null, DatabaseError);
        }
    }

    async create(username, mobile, uniqueUserID) {
        try {
            await this.bind();
            const orgPerson = {
                objectClass: ['inetOrgPerson', 'organizationalPerson', 'person'],
                sn: `${uniqueUserID}`,
                cn: `${username}`,
                mobile: `${mobile}`
            };

            console.log({
                message: `Adding User with the following credentials: cn=${username},${this.domain}`
            });
            await new Promise((resolve, reject) => this.client.add(`cn=${username},${this.domain}`, orgPerson, (err) => {
                if (err) {
                    this.ctx = `OrgPerson - ${err.code}: ${err.name}`;
                    reject(err);
                }
                resolve();
            }));

            await this.unbind();

            return uniqueUserID;
        } catch (err) {
            console.log({
                message: JSON.stringify(err)
            });
            throw this.ldapErrorHandler(err, this.ctx, events.LdapCreateError(username));
        }
    }

    async read(searchAttr, value) {
        try {
            await this.bind();

            const searchOptions = {
                filter: `(&(${searchAttr}=${value}))`,
                scope: "sub",
                attributes: 'cn'
            };
            const search = await new Promise((resolve, reject) => this.client
                .search(this.domain, searchOptions, (err, data) => {
                    if (err) {
                        console.log('erreo', err);
                        this.ctx = `Search - ${err.code}: ${err.name}`;
                        reject(err);
                    }
                    const results = [];

                    data.on('searchEntry', function (entry) {
                        console.log('Entry', JSON.stringify(entry));
                        console.log('Entry Object', entry.object);
                    });

                    data.on('error', (e) => {
                        console.log('SearchEntryError', e);
                        this.ctx = `SearchEntry - ${e.code}: ${e.name}`;
                        reject(e);
                    });

                    data.on('end', function (result) {
                        console.log('Result is', result);
                    });
                }));

            await this.unbind();

            console.log({
                message: `Read record for attribute, ${searchAttr}: ${value} complete.`
            });
            return search;
        } catch (err) {
            console.log({
                errorLDAP1: err
            });
            throw this.ldapErrorHandler(err, this.ctx, events.LdapReadError(value));
        }
    }

    async readAllAttributes(searchAttr, value) {
        try {
            await this.bind();

            const searchOptions = {
                filter: `(&(${searchAttr}=${value}))`,
                scope: 'sub'
            };
            const search = await new Promise((resolve, reject) => this.client
                .search(this.domain, searchOptions, (err, data) => {
                    if (err) {
                        this.ctx = `Search - ${err.code}: ${err.name}`;
                        reject(err);
                    }
                    const results = [];

                    data.on('searchEntry', event => results.push(event.object));

                    data.on('error', (e) => {
                        this.ctx = `SearchEntry - ${e.code}: ${e.name}`;
                        reject(e);
                    });

                    data.on('end', () => {
                        resolve(results);
                    });
                }));

            await this.unbind();

            console.log({
                message: `Read record for attribute, ${searchAttr}: ${value} complete.`
            });
            return search;
        } catch (err) {
            throw this.ldapErrorHandler(err, this.ctx, events.LdapReadError(value));
        }
    }

    async update(username, keyToChange, updatedValue) {
        try {
            await this.bind();

            const change = new ldap.Change({
                operation: 'replace',
                modification: {
                    [`${keyToChange}`]: `${updatedValue}`
                }
            });

            const modifiedUser = await new Promise((resolve, reject) => this.client
                .modify(`cn=${username},${this.domain}`, change, (err) => {
                    if (err) {
                        this.ctx = `Update - ${err.code}: ${err.name}`;
                        reject(err);
                    }
                    resolve(username);
                }));

            await this.unbind();

            console.log({
                message: `Modify user ${username} complete`
            });
            return modifiedUser;
        } catch (err) {
            throw this.ldapErrorHandler(err, this.ctx, events.LdapUpdateError(err.message));
        }
    }

    async deleteUser(username) {
        try {
            await this.bind();

            const deleted = await new Promise((resolve, reject) => this.client
                .del(`cn=${username},${this.domain}`, (err) => {
                    if (err) {
                        this.ctx = `Delete - ${err.code}: ${err.name}`;
                        reject(err);
                    }
                    resolve(true);
                }));

            await this.unbind();

            console.log({
                message: `User Deleted from LDAP - username: ${username}`
            });
            return deleted;
        } catch (err) {
            throw this.ldapErrorHandler(err, this.ctx, events.LdapDeleteError(username));
        }
    }
};