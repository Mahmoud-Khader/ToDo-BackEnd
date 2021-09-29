'use strict';
// 3rd party resoursec
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric resoursec
const notFoundHandler = require('./error-hanlers/404');
const errorHandler = require('./error-hanlers/500');
const logger = require('./middleware/logger');
const authroutes = require('./routes/routes');


const v1Routes = require('./routes/v1');



//prepare express app
const app = express();

// app level middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//// app.use(multParse.none());

//test
app.get('/', (req, res) => {
  res.status(200).send('Hello From API 🌞😎🌞!')
})
//routes
app.use(logger);
app.use(authroutes);
app.use('/api/v1', v1Routes);


//catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);



module.exports = {
  server: app,
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};