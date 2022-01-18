const mysql = require("../config/mysql");
const bcrypt = require("bcrypt");
const jwt = require("../plugins/jwt.utils");

const userInfo = ({ password, ...obj }) => obj;

module.exports = {
  login: async (req, res) => {
    const email = req.body.email || "";
    const pass = req.body.pass || "";
    const errorMSG = "e-mail / Mot de passe incorrect";

    const result = await mysql(
      `SELECT *  FROM user_admin WHERE email='${email}'`
    );

    if (![...result].length) {
      return res.send({ error: errorMSG });
    } else {
      const compare = await bcrypt.compare(pass, result[0].password);

      if (compare == true) {
        const token = jwt.generateTokenForUser(result[0], 3600 * 24 * 90);

        res.send({ userInfo: userInfo(result[0]), token: token });
      } else if (compare == false) {
        return res.send({ error: errorMSG });
      }
    }
  },
  auth: async (req, res) => {
    const token = req.body.token || "";

    const auth = jwt.getUserInfo(token);

    if (auth == -1) {
      return res.send({ error: "disconnect" });
    } else {
      const result = await mysql(
        `SELECT *  FROM user_admin WHERE id = ${auth.userId}`
      );

      if (![...result].length) {
        return res.send({ error: "disconnect" });
      } else {
        const token = jwt.generateTokenForUser(result[0], 3600 * 24 * 90);

        return res.send({ token: token, userInfo: userInfo(result[0]) });
      }
    }
  },
};
