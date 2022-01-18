const req = require("express/lib/request");
const mysql = require("../config/mysql");
const jwt = require("../plugins/jwt.utils");

const {
  type,
  category,
  localisation,
  capitalType,
} = require("../config/store");

module.exports = {
  find: async (req, res) => {
    const result = await mysql(
      "SELECT * ,(SELECT title FROM agency WHERE agency.id = scpi.parentAgency) AS agencyName  FROM scpi ORDER BY id DESC"
    );
    res.send(result);
  },
  findLimit: async (req, res) => {
    const param = req.params.limit || "0-10";
    const start = +param.split("-")[0] || 0;
    const limit = +param.split("-")[1] || 10;
    const result = await mysql(
      `SELECT *  ,(SELECT title FROM agency WHERE agency.id = scpi.parentAgency) AS agencyName  FROM scpi  ORDER BY id DESC LIMIT ${+start}  , ${+limit} `
    );

    res.send(result);
  },

  findOne: async (req, res) => {
    const slug = req.params.slug || "";
    const _scpi = await mysql(`SELECT * FROM scpi WHERE slug = '${slug}'`);
    const scpi = _scpi[0];
    const agency = !!_scpi.length
      ? (
          await mysql(`SELECT * FROM agency WHERE id = ${scpi.parentAgency} `)
        )[0]
      : null;

    res.send({ ...scpi, agency: agency });
  },

  search: async (req, res) => {
    const q = (req.params.q || "").split("+").join(" ");
    const result = await mysql(
      `SELECT * ,(SELECT title FROM agency WHERE agency.id = scpi.parentAgency) AS agencyName FROM scpi WHERE title LIKE '%${q}%' `
    );
    res.send(result);
  },
  create: async (req, res) => {
    const body = req.body;
    // dont forget to verify admin
    const token = req.body.token || "";

    const auth = jwt.getUserInfo(token);
    if (auth == -1) {
      return res.send({ error: "disconnect" });
    }
    //  verify info
    const idParentAgency = +body.parentAgency;
    const parentAgency = await mysql(
      `SELECT COUNT(*) AS count  FROM agency WHERE id =${idParentAgency || 0} `
    );
    if (parentAgency[0].count == 0) {
      return res.send({ error: "cette agence n'exite pas " });
    }
    if (
      !body.title ||
      !body.slug ||
      !type.includes(body.type) ||
      !category.includes(body.category) ||
      !localisation.includes(body.localisation) ||
      !capitalType.includes(body.capitalType) ||
      !body.capitalisation ||
      !body.profil ||
      !body.history ||
      !body.description ||
      !body.periodOfEnjoyment ||
      !body.subscriptionFee ||
      !body.gestionFee
    ) {
      return res.send({ error: "champ manquant , veillez réesayer !" });
    }

    // syntaxe
    Syntaxe =
      "INSERT INTO scpi (`parentAgency`, `title`,`slug` ,`inOurSelection`, `lifeInsurance`, `type`, `category`, `localisation`, `distributionRate`, `partPrice`, `capitalisation`, `scpiCreation`, `profil`, `history`, `description`, `capitalType`, `minSub`, `periodOfEnjoyment`, `subscriptionFee`, `gestionFee`, `visaAMF`) VALUES ";

    const result = await mysql(
      Syntaxe +
        ` (${idParentAgency}, "${body.title}","${body.slug}" , ${body.inOurSelection} ,  ${body.lifeInsurance} , "${body.type}", "${body.category}", "${body.localisation}", ${body.distributionRate} , "${body.partPrice}" , ${body.capitalisation} , "${body.scpiCreation}", "${body.profil}", "${body.history}", "${body.description}", "${body.capitalType}", ${body.minSub} ,  ${body.periodOfEnjoyment} , ${body.subscriptionFee} ,  ${body.gestionFee} , "${body.visaAMF}" )`
    );

    return res.send({ success: "élement Ajoutée avec success" });
  },

  update: async (req, res) => {
    const body = req.body;
    console.log("body:", body);
    // dont forget to verify admin
    const token = req.body.token || "";

    const auth = jwt.getUserInfo(token);
    if (auth == -1) {
      return res.send({ error: "disconnect" });
    }

    //  verify info

    const idScpi = +body.id;
    const parentscpi = await mysql(
      `SELECT COUNT(*) as count FROM scpi WHERE id =${idScpi} `
    );

    if (parentscpi[0].count == 0) {
      return res.send({ error: "cette scpi  n'exite pas " });
    }

    const idParentAgency = +body.parentAgency;
    const parentAgency = await mysql(
      `SELECT COUNT(*) AS count  FROM agency WHERE id =${idParentAgency || 0} `
    );
    if (parentAgency[0].count == 0) {
      return res.send({ error: "cette agence n'exite pas " });
    }

    if (
      !body.title ||
      !body.slug ||
      !type.includes(body.type) ||
      !category.includes(body.category) ||
      !localisation.includes(body.localisation) ||
      !capitalType.includes(body.capitalType) ||
      !body.capitalisation ||
      !body.profil ||
      !body.history ||
      !body.description ||
      !body.periodOfEnjoyment ||
      !body.subscriptionFee ||
      !body.gestionFee
    ) {
      return res.send({ error: "champ manquant , veillez réesayer !" });
    }

    // syntaxe
    const Syntaxe = " UPDATE `scpi` SET ";

    const result = await mysql(
      Syntaxe +
        ` parentAgency= "${idParentAgency}", title="${body.title}",slug="${body.slug}" ,inOurSelection="${body.inOurSelection}",lifeInsurance="${body.lifeInsurance}",type="${body.type}", category="${body.category}", localisation="${body.localisation}" , distributionRate="${body.distributionRate}", partPrice="${body.partPrice}, capitalisation=${body.capitalisation}", scpiCreation="${body.scpiCreation}", profil="${body.profil}", history="${body.history}", description="${body.description}", capitalType="${body.capitalType}", minSub="${body.minSub}", periodOfEnjoyment="${body.periodOfEnjoyment}", subscriptionFee="${body.subscriptionFee}", gestionFee="${body.gestionFee}", visaAMF="${body.visaAMF}"  WHERE  id =${body.id} `
    );

    return res.send({ success: "élement modifier avec success" });
  },
  delete: async (req, res) => {
    // dont forget verify if is admin
    const token = req.body.token || "";

    const auth = jwt.getUserInfo(token);
    if (auth == -1) {
      return res.send({ error: "disconnect" });
    }

    //---
    const result = await mysql(`DELETE FROM scpi WHERE id=${+req.body.id} `);
    console.log(`DELETE FROM scpi WHERE id=${+req.body.id} `);

    // on va voir la reponse lors du débugage
    res.send({ success: "élément supptimé !" });
  },
  filter: async (req, res) => {
    const queryParams = req.query || {};
    const param = req.params.limit || "0-10";
    const start = +param.split("-")[0] || 0;
    const limit = +param.split("-")[1] || 10;

    let condition = " WHERE id  IS NOT NULL ";
    if (!!queryParams.q) {
      condition += ` AND title LIKE '%${queryParams.q}%' `;
    }

    if (!!queryParams.parentAgency) {
      condition += ` AND parentAgency = '${queryParams.parentAgency}' `;
    }

    if (queryParams.inOurSelection) {
      condition += ` AND  parentAgency = '${queryParams.inOurSelection}' `;
    }

    if (!!queryParams.type) {
      const arr = (queryParams.type || "").split(",");
      condition += " AND  (";
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        condition += ` type = '${element}' ${
          index + 1 != arr.length ? "OR" : ")"
        } `;
      }
    }

    if (!!queryParams.category) {
      const arr = (queryParams.category || "").split(",");
      condition += " AND  (";
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        condition += ` category = '${element}' ${
          index + 1 != arr.length ? "OR" : ")"
        } `;
      }
    }

    if (!!queryParams.localisation) {
      const arr = (queryParams.localisation || "").split(",");
      condition += " AND  (";
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        condition += ` localisation = '${element}' ${
          index + 1 != arr.length ? "OR" : ")"
        } `;
      }
    }

    if (!!queryParams.lifeAssurance) {
      const arr = (queryParams.lifeAssurance || "").split(",");
      condition += " AND ( ";
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        condition += ` lifeInsurance = '${element}' ${
          index + 1 != arr.length ? "OR" : ")"
        } `;
      }
    }
    const Syntaxe = `SELECT *  ,(SELECT title FROM agency WHERE agency.id = scpi.parentAgency) AS agencyName  FROM scpi ${condition}  ORDER BY id DESC LIMIT ${+start}  , ${+limit} `;

    const result = await mysql(Syntaxe);
    res.send(result);
  },
};
