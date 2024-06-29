const express = require('express');
const session = require('express-session');
const cors = require('cors')
const userRouter = require('./router/user');
const dbConnect = require('./connector/mongoConnect');
const brandRouter = require('./router/brand');
const categoryRouter = require('./router/category');
const blogRouter = require('./router/blog');
const productRouter = require('./router/product');
const reviewRouter = require('./router/review');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
require('dotenv').config();

const app = express();
const routerPublic = express.Router();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(session({ resave: true, secret: '123456', saveUninitialized: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cors())


routerPublic.use('/api/user', userRouter);
routerPublic.use('/api/brand', brandRouter);
routerPublic.use('/api/category', categoryRouter);
routerPublic.use('/api/post', blogRouter);
routerPublic.use('/api/product', productRouter);
routerPublic.use('/api/review', reviewRouter);

app.use(routerPublic);

dbConnect();

app.listen(process.env.PORT || 5005, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
