const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');

const userRouter = require('./routes/userRouter');
const schoolRouter = require('./routes/schoolRouter');
const departmentRouter = require('./routes/departmentRouter');
const courseRouter = require('./routes/courseRouter');
const semesterRouter = require('./routes/semesterRouter');

const app = express();

//implement CORS: allows CORS for all incoming requests to our API.
app.use(cors());

app.options('*', cors()); //all resources

// Set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// app.use(cookieParser()) is setting up a middleware that will parse incoming request
//headers for cookies and make them available on the request object.
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/schools', schoolRouter);
app.use('/api/v1/departments', departmentRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/semesters', semesterRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

module.exports = app;
