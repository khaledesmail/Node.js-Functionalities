const profileTokenModel = require('../model/profileToken');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const _ = require('lodash');
const {
    v4: uuidv4
} = require('uuid');

const SECRET = process.env.SECRET || config.jwt.SECRET;


class TokenSerivce {
    constructor(model) {
        this.model = model;
    }
    async generateToken(data) {
        let profileData = {}
        let now = (new Date().getTime()) / 1000; // Time now in unix format
        let after24h = (new Date().getTime() + 1440 * 60 * 1000) / 1000; // Time after 24 Hours
        const id = data._id;
        let payload = {
            "iss": id,
            "iat": now,
            "sub": "tazweed|77",
            "exp": after24h
        };
        var token = jwt.sign(payload, SECRET);
        profileData.email = data.email;
        profileData.token = token;
        profileData.profileId = id;
        console.log('profileData', profileData);
        let profile = await this.model.create(profileData);
        return profile;
    }

    async findByToken(token, cb) {
        jwt.verify(token, SECRET, function (err, decode) {
            if (err) return cb(err);
            cb(null, decode);
        })
    }


}
module.exports = new TokenSerivce(profileTokenModel);