const bcrypt = require('bcryptjs');
const responseCodes = require('../config/responseCodes');
const TokenSerivce = require('./TokenSerivce');
const model = require('../model/profile');
const _ = require('lodash');

class ProfileService {
    constructor() {
    }
async signin(body, cookies) {
    let response = {};
    try {
        logger.info('_____________SIGNIN METHOD SERVICE____________');
        let token = cookies.auth;
        logger.info('tokeen', token);
        let hasToken = await TokenSerivce.findOne({
            email: body.email,
            token: token
        });
        logger.info('hasToken', hasToken);
        if (hasToken) {
            response = responseCodes["01"];
            response.body.data = hasToken;
            return response;
        }
        let hasProfile = await this.findOne({
            email: body.email
        });
        logger.info('hasProfile', hasProfile);
        if (hasProfile) {
            let isMatch = await this.compareAsync(body.password, hasProfile.password);
            logger.info('isMatch', isMatch);
            if (!isMatch) return responseCodes["02"];
            let existToken = await TokenSerivce.generateToken(hasProfile);
            logger.info('existToken', existToken);
            if (existToken) {
                response = responseCodes["03"];
                response.body.data = existToken;
                return response;
            }
            return responseCodes["04"];
        }
        return responseCodes["05"];
    } catch (error) {
        logger.info('error', error);
        response = responseCodes["07"];
        response.body.data = error;
        return response;
    }
}

compareAsync(commingPassword, realPassword) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(commingPassword, realPassword, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

async findOne(query) {
    try {
    let response = await model.findOne(query).exec();
    return response;
} catch (error) {
    logger.info('error', error);
    response = responseCodes["07"];
    response.body.data = error;
    return response;
}
}
}
module.exports = new ProfileService();