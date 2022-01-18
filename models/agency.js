const mysql = require("../config/mysql");
const { validateEmail, validatePhone } = require("../plugins/validate");

const jwt = require("../plugins/jwt.utils");

module.exports = {
  find: async (req, res) => {
    const result = await mysql(
      "SELECT * , (SELECT COUNT(*) FROM scpi WHERE agency.id = scpi.parentAgency ) AS scpiLength FROM agency ORDER BY id DESC"
    );
    res.send(result);
  },
  findLimit: async (req, res) => {
    const param = req.params.limit || "0-10";
    const start = +param.split("-")[0] || 0;
    const limit = +param.split("-")[1] || 10;
    const result = await mysql(
      `SELECT * , (SELECT COUNT(*) FROM scpi WHERE agency.id = scpi.parentAgency ) AS scpiLength FROM agency ORDER BY id DESC LIMIT ${start}  , ${limit}`
    );
    res.send(result);
  },

  findOne: async (req, res) => {
    const slug = req.params.slug || null;
    const agency = await mysql(
      `SELECT * , (SELECT COUNT(*) FROM scpi WHERE agency.id = scpi.parentAgency ) AS scpiLength FROM agency WHERE slug = '${slug}'`
    );

    const idAgency = !![...agency].length ? agency[0].id : null;
    const scpi = await mysql(
      `SELECT * FROM scpi WHERE parentAgency = ${idAgency}`
    );

    res.send({
      ...agency[0],
      scpi: scpi,
    });
  },

  search: async (req, res) => {
    const q = (req.params.q || "").split("+").join(" ");
    const result = await mysql(
      `SELECT * , (SELECT COUNT(*) FROM scpi WHERE agency.id = scpi.parentAgency ) AS scpiLength FROM agency WHERE title LIKE '%${q}%' `
    );
    res.send(result);
  },
  create: async (req, res) => {
    const body = req.body;
    // dont forget to verify admin
    const token = req.body.token || "";
    
    const auth  = jwt.getUserInfo(token)
    if (auth == -1) {
      return res.send({error:"disconnect"})
    }

    //  verify info

    [
      !body.slug ,
      !body.title ,
      !body.logo_url ,
      !body.bio ,
      !body.address ,
      !body.agencyCreation ,
      !body.encours ,
      !body.fund ,
      !body.effective ,
      !body.MajorityShareholder ,
      !body.phone ,
      !validatePhone(body.phone) ,
      !body.email ,
      !validateEmail(body.email)].map((i,k)=>{
        console.log('(i,k)=:-',  !i ? "oui":"non" ,k)

      } )


    //
    if (
      !body.slug ||
      !body.title ||
      !body.logo_url ||
      !body.bio ||
      !body.address ||
      !body.agencyCreation ||
      !body.encours ||
      !body.fund ||
      !body.effective ||
      !body.MajorityShareholder ||
      !body.phone ||
      !validatePhone(body.phone) ||
      !body.email ||
      !validateEmail(body.email)
    ) {
      return res.send({
        error: "champ manquant , veillez réesayer !",
      });
    }

    // syntaxe
    Syntaxe =
      "INSERT INTO agency ( `slug`,`title`,`logo_url`, `bio`,`address`,`agencyCreation`,`encours`,`fund`,`effective`,`MajorityShareholder`,`phone`,`email`) VALUES";

console.log('====================================');
console.log(  Syntaxe +
  ` ( '${body.slug}','${body.title}','${body.logo_url}','${body.bio}','${body.address}','${body.agencyCreation}','${body.encours}','${body.fund}','${body.effective}','${body.MajorityShareholder}','${body.phone}','${body.email}');`);
console.log('====================================');
      
    const result = await mysql(
      Syntaxe +
      ` ( '${body.slug}','${body.title}','${body.logo_url}','${body.bio}','${body.address}','${body.agencyCreation}','${body.encours}','${body.fund}','${body.effective}','${body.MajorityShareholder}','${body.phone}','${body.email}');`
    );

    return res.send({ success: "élement Ajouté avec success" });
  },

  update: async (req, res) => {
    const body = req.body;
    // dont forget to verify admin
    const token = req.body.token || "";
    
    const auth  = jwt.getUserInfo(token)
    if (auth == -1) {
      return res.send({error:"disconnect"})
    }
    //  verify info

    const exist = await mysql(
      `SELECT COUNT(*) AS count  FROM agency WHERE id =${body.id  || 0} `
    );
    console.log('exist:', exist)
    if (exist[0].count==0) {
      return res.send({
        error: "cette agence n'exite pas ",
      });
    }

    if (
      !body.slug ||
      !body.title ||
      !body.logo_url ||
      !body.bio ||
      !body.address ||
      !body.agencyCreation ||
      !body.encours ||
      !body.fund ||
      !body.effective ||
      !body.MajorityShareholder ||
      !body.phone ||
      !validatePhone(body.phone) ||
      !body.email ||
      !validateEmail(body.email)
    ) {
      return res.send({
        error: "champ manquant , veillez réesayer !",
      });
    }

    // syntaxe
    const Syntaxe =  ` UPDATE  agency  SET slug = "${body.slug}",
    title = "${body.title}",
    logo_url = "${body.logo_url}",
    bio = "${body.bio}",
    address = "${body.address}",
    agencyCreation = "${body.agencyCreation}",
    encours = "${body.encours}",
    fund = "${body.fund}",
    effective = "${body.effective}" ,
    MajorityShareholder = "${body.MajorityShareholder}",
    email = "${body.email}",
    phone = "${body.phone}" WHERE  id =${body.id} `

    const result = await mysql(Syntaxe);
    console.log('===================================='); 
    console.log('Syntaxe:', Syntaxe)
    console.log('====================================');

    return res.send({ success: "élement modifier avec success" });
  },
  delete: async (req, res) => {
    // dont forget verify if is admin
    const token = req.body.token || "";
    
    const auth  = jwt.getUserInfo(token)
    if (auth == -1) {
      return res.send({error:"disconnect"})
    }

    ///-----
    const result = await mysql(`DELETE FROM agency WHERE id= ${+req.body.id} `);

    // on va voir la reponse lors du débugage
    res.send({
      success: "élément supptimé !",
    });
  },
};

 