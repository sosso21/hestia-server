import { type, category, localisation, capitalType } from "./store";
// generation

const get_random = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};
let getRandomDate = () => {
  return new Date(+new Date() * Math.random());
};

// random logo au haard
const logo = [
  "https://fortunyconseil.fr/Access/public/uploads/images/societe_gestion/aestiam_ex_foncia_pierre_gestion-5f6765df8f6d3.png",
  "https://fortunyconseil.fr/Access/public/uploads/images/societe_gestion/bnp_paribas_real_estate-5fbd087e15bdd.jpeg",
  "https://fortunyconseil.fr/Access/public/uploads/images/societe_gestion/fonciere__territoires-5fd9df138adad.png",
  "https://fortunyconseil.fr/Access/public/uploads/images/societe_gestion/norma_capital-5f660c5503039.jpeg",
  "https://fortunyconseil.fr/Access/public/uploads/images/societe_gestion/unofi-6019a7c47c712.png",
];
const addres_random = [
  "draa ben khedda",
  "Tizi Ouzou",
  "Azzazga",
  "Bejaia",
  "Alger",
  "Paris",
  "Marseille",
  "Mascou",
  "Telaviv",
  "Kaboul",
  "Chernobyl",
];

const randomName = [
  "Sofiane",
  "Brahim",
  "Djamal",
  "Amine",
  "lounes",
  "paul",
  "Mohamed",
  "Axel",
  "Silvia",
  "Lisa",
  "Estebane",
  "zia",
  "Tao",
];

let syntaxeAgency ="INSERT INTO agency ( `slug`,`title`,`logo_url`, `bio`,`address`,`agencyCreation`,`encours`,`fund`,`effective`,`MajorityShareholder`,`phone`,`email`) VALUES";

let syntaxeSCPI = "INSERT INTO scpi (`parentAgency`, `title`,`slug`, `inOurSelection`, `lifeInsurance`, `type`, `category`, `localisation`, `distributionRate`, `partPrice`, `capitalisation`, `scpiCreation`, `profil`, `history`, `description`, `capitalType`, `minSub`, `periodOfEnjoyment`, `subscriptionFee`, `gestionFee`, `visaAMF`) VALUES";

const GenerateagencyWithAPI = () => {
  fetch("https://jsonplaceholder.typicode.com/comments")
    .then((response) => response.json())
    .then((response) => {
      const data = response.filter((i, k) => k < 20);
      console.log("====================================");
      console.log(data.length);
      console.log("====================================");

      for (let index = 0; index < data.length; index++) {
        const element = data[index];

        syntaxeAgency += `\n ( '${element.name.split(" ").join("-")}','${
          element.name
        }','${get_random(logo)}', '${element.body}','${get_random(
          addres_random
        )}','${getRandomDate().toLocaleDateString('en-CA')}','${
          Math.round(Math.random() * 1000) / 100
        }','${Math.round(Math.random() * 1000000000)}','${Math.round(
          Math.random() * 10
        )}','${get_random(randomName)}','${Math.round(
          Math.random() * 1000000000
        )}','${element.email}')`;

        if (index + 1 == data.length) {
          syntaxeAgency += ";";
        } else {
          syntaxeAgency += ",";
        }
      }

      console.log(syntaxeAgency);

      console.log(" \n **************************************** ");
      console.log(" \n **************************************** ");
      console.log(" \n **************************************** ");
      console.log(" \n **************************************** ");
      console.log(" \n **************************************** ");

      for (let index = 0; index < response.length; index++) {
        const element = response[index];

        const periodOfEnjoyment =
          Math.round(Math.random() * 10) +
          " Jour du " +
          Math.round(Math.random() * 10) +
          " Mois";

        syntaxeSCPI += `\n ("${get_random(data).id}", "${
          element.name
        }","${element.name.split(" ").join("-")}" , "${get_random([
          0,
          1,
        ])}", "${get_random([0, 1])}", "${get_random(
          type
        )}", "${get_random(category)}", "${get_random(localisation)}", "${
          Math.round(Math.random() * 1000) / 100
        }", "${Math.round(Math.random() * 1000)}", "${Math.round(
          Math.random() * 100000000
        )}", "${getRandomDate().toLocaleDateString('en-CA')}", "${element.body}", "${
          element.body
        }", "${element.body}", "${get_random(capitalType)}", "${Math.round(
          Math.random() * 10
        )}", "${periodOfEnjoyment}", "${element.body}", "${
          Math.round(Math.random() * 10000) / 100
        }", "${element.name}")`;

        if (index + 1 == response.length) {
          syntaxeSCPI += ";";
        } else {
          syntaxeSCPI += ",";
        }
      }

      console.log(syntaxeSCPI);
    });
};
GenerateagencyWithAPI();
