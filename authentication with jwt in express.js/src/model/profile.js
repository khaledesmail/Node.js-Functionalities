const mongoose = require('mongoose');
const {
    Schema
} = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/default.json');

const salt = config.jwt.SALT;


class profile {
    initSchema() {
        const profileSchema = new Schema({
            firstName: {
                type: "string",
                required: true
            },
            lastName: {
                type: "string",
                required: true
            },
            email: {
                type: "string",
                required: true,
                trim: true
            },
            password: {
                type: "string",
                required: true,
                minlength: 8
            },
            isVerified: {
                type: "Boolean",
                default: false
            },
            mobileNumber: {
                type: "string",
                required: true
            },
            country: {
                type: "string",
                required: true
            },
            fieldsOfInterest: {
                type: "array",
                required: false
            },
            urlPicture: {
                type: "string",
                required: false
            },
            termsAndConditions: {
                type: "Boolean",
                required: true
            },
            token: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                enum: ['active', 'pending', 'inprogress'],
                default: 'pending',
                required: true
            },
            fieldOfSpecialisation: {
                type: "array",
                required: false
            },
            writerPage: {
                type: "string",
                required: false
            },
            customerType: {
                type: "string",
                enum: ['client', 'partner', 'admin'],
                required: true
            }
        }, {
            timestamps: true
        });
        // to signup a profile
        profileSchema.pre('save', function (next) {
            var profile = this;
            if (profile.isModified('password')) {
                bcrypt.genSalt(salt, function (err, salt) {
                    if (err) return next(err);

                    bcrypt.hash(profile.password, salt, function (err, hash) {
                        if (err) return next(err);
                        profile.password = hash;
                        next();
                    })

                })
            } else {
                next();
            }
        });
        mongoose.model('profile', profileSchema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('profile');
    }

}

module.exports = new profile().getInstance();