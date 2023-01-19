const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./routes/userRouter');

const app = express();

//implement CORS: allows CORS for all incoming requests to our API.
app.use(cors());
//Access-Control-Allow-Origin
//if we wanted to not have CORS for all requests 
// however our backend and frontend exist on different urls
//backend: api.natours.com    front-end:natours.com
// app.use(cors({
//   origin:'https://www.natours.com'
// }));

app.options('*', cors());//all resources
// app.options('/api/v1/tours/:id', cors());//single resource

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }


  // 3) ROUTES
app.use('/', userRouter);


module.exports = app;