var mongoose = require('mongoose');

class profileToken {
    constructor(model) {
        this.model = model;
    }
    initSchema() {
        const profileTokenSchema = mongoose.Schema({
            email: {
                type: String,
                required: true,
            },
            token: {
                type: String
            },
            profileId: {
                type: String
            },
            createAt: {
                type: Date,
                default: Date.now(),
                index: {
                    expires: 18000
                }
            } // 5 hours
        });
        //delete token
        profileTokenSchema.methods.deleteToken = function (token, cb) {
            var profileToken = this;

            profileToken.update({
                $unset: {
                    token: 1
                }
            }, function (err, profileToken) {
                if (err) return cb(err);
                cb(null, profileToken);
            })
        }
        mongoose.model('profileToken', profileTokenSchema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('profileToken');
    }

}
module.exports = new profileToken().getInstance();