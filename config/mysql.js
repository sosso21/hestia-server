const mysql = require("mysql");
const config = require("./config.json");

const connection = mysql.createConnection(config.development);
 

module.exports = async (query) => {
  try {
    const response = await new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) reject(new Error(err.message));
        resolve(results);
      });
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

 