const express = require('express');
const session=require('express-session');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
require('dotenv').config()

 const createInitialSession = require('./middlewares/session');
const filter = require('./middlewares/filter.js');

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );
app.use(session({
   secret:process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,
   cookie:
    {maxAge:10000}
}));

 app.use((req,res,next)=>createInitialSession(req,res,next));
app.use((req,res,next)=>{
    if(req.method==='POST' || req.method==='PUT'){filter(req,res,next);}
    else {next();}
});


const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get(messagesBaseUrl+'/history', mc.history);

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );