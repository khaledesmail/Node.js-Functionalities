const tokenSerivce = require('../services/TokenSerivce');

let auth = (req, res, next) => {
    let token = req.cookies.auth;
    tokenSerivce.findByToken(token, (err, profileToken) => {
        if (err) {
            return res.json({
                error: true,
                mesaage: err
            });
        };
        if (!profileToken) return res.json({
            error: true,
            mesaage: "Profile not exists"
        });
        next();
    })
}

module.exports = {
    auth
};