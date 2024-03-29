const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const db = require('./models');
const app = express();
const PORT = process.env.PORT || 8000;


// this lets us parse 'application/json' content in http requests
app.use(bodyParser.json())

// add http request logging to help us debug and audit app use
const logFormat = process.env.NODE_ENV==='production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// this mounts controllers/index.js at the route `/api`
app.use('/api', require('./controllers'));

// for production use, we serve the static react build folder
if(process.env.NODE_ENV==='production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // all unknown routes should be handed to our react app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// update DB tables based on model updates. Does not handle renaming tables/columns
// NOTE: toggling this to true drops all tables (including data)
db.sequelize.sync({ force: false });

// start up the server
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Ports being used: 

app.get('/api/bathrooms', (req,res) => {
  //get all bathrooms data from the database
  const bathrooms = [
    {id:1, business_name:'Starbucks',location:'Lat:81 Long:32', rating:'9', tag:'coffee place'},
    {id:2, business_name:'MC Donalds',location:'Lat:86 Long:42', rating:'1', tag:'Fast-Food'},
    {id:3, business_name:'Park 101',location:'Lat:41 Long:62', rating:'4', tag:'public park'}
  ];
  res.json(bathrooms);
});







