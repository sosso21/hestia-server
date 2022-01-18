// Imports
const express     = require('express');
const bodyParser  = require('body-parser');
const cors = require('cors');
const apiRouter   = require('./apiRouter').router;

// Instantiate server
const app = express();

 
// cors 

app.use(cors({
    origin: '*'
}));


// Body Parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure routes
app.get('/',  (req, res) =>{
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon super server</h1>');
});

app.use('/api/', apiRouter);



const host = process.env.HOST|| "localhost";
const port = process.env.PORT|| 8000;

// Launch server
app.listen(port, () =>{
    console.log('Server en écoute :) sur : ',host+":"+port);
});