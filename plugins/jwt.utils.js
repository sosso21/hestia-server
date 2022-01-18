const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = "M3rcury1_V3nus2_T3rr33_M4rs4_Jupit3r5_5aturne_Ur4nu56_N3ptun7_314159265358979323";

// Exported functions
module.exports = {
    generateTokenForUser: (userData, expireIn = (60*15), suplement = null) => {

        let payload = {
            userId: userData.id
        };
        if (suplement != null) 
        {
            payload = Object.assign(payload, suplement);
        }


        return jwt.sign(
            payload,
            JWT_SIGN_SECRET, {
                expiresIn: expireIn // sexonde
            })
    },
    parseAuthorization: (authorization) => {
        
        return !!authorization ? authorization.replace('Bearer ', '') : null;
    },
    getUserInfo: (authorization) => {
        let info = -1;
        const token = module.exports.parseAuthorization(authorization);
        if (token != null) {

            try {
                const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null)
                    info = jwtToken;

            } catch (err) {}
        }
        
        return info;
    }
}