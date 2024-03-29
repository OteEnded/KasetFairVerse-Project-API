const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const putil = require('./utilities/projectutility')
// const dbconnector = require('./services/dbconnector')
const dbrelationdefiner = require('./services/dbrelationdefiner')

putil.log("###--------------------------------------------------###")
putil.log("app[main]: imported every primary module, starting the app...")

// dbconnector.connect()
dbrelationdefiner.defineRelationships();

// import routes
const apiMiddleware = require('./services/apimiddleware');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/api/Admin_router');
const testingRouter = require('./routes/api/Testing_router');
const usersRouter = require('./routes/api/Users_router');
const accessoriesRouter = require('./routes/api/Accessories_router');
const coffeebeanRouter = require('./routes/api/CoffeeBean_router');
const cornmilkRouter = require('./routes/api/CornMilk_router');
const cosmeticRouter = require('./routes/api/Cosmetic_router');
const hempRouter = require('./routes/api/Hemp_router');
const kubkaokabgangRouter = require('./routes/api/KubKaoKabGang_router');

const app = express();
app.use(cors());
app.use(favicon('./public/images/tab-icon.ico'));
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile); // Set the HTML rendering engine
app.set('view engine', 'html'); // Set the view engine to render HTML
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.static('node_modules'));

// Create a simple in-memory cache to track IPs
const ipCache = {};

// Custom middleware to check if IP is blacklisted
const checkBlacklist = (req, res, next) => {
    const clientIp = req.ip; // Express automatically determines the client's IP

    if (ipCache[clientIp] && ipCache[clientIp].exceededLimit) {
        return res.status(429).send('Rate limit exceeded. You are blacklisted.');
    }

    next();
};

// Rate-limit middleware with some custom options
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 300, // max requests per window
    handler: (req, res) => {
        const clientIp = req.ip;

        // Update tracking data for the blacklisted IP
        ipCache[clientIp] = { exceededLimit: true };

        res.status(429).send('Rate limit exceeded. You are blacklisted.');
    },
});

// Apply the checkBlacklist middleware before the rate limiter
app.use(checkBlacklist);
app.use(limiter);

// config routes
app.use(apiMiddleware.logRequest);
app.use('/.well-known/acme-challenge', express.static(path.join(__dirname, 'public', '.well-known', 'acme-challenge')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', indexRouter);

// config api routes
app.use('/Api/Admin', adminRouter);
app.use('/Api/Testing', testingRouter);
app.use('/Api/Users', usersRouter);
app.use('/Api/Accessories', accessoriesRouter);
app.use('/Api/CoffeeBean', coffeebeanRouter);
app.use('/Api/Cornmilk', cornmilkRouter);
app.use('/Api/Cosmetic', cosmeticRouter);
app.use('/Api/KubKaoKabGang', kubkaokabgangRouter);
app.use('/Api/Hemp', hempRouter);

// special - cosmetic add play lifes function
const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => { // every day at 00:00 (UTC+7)
    // add play lifes to every user in play lifes table
    const Cosmetic = require('./models/Cosmetic');
    putil.log("app[cron]: Adding play lifes to every user in Cosmetic_HoldYourBasket_PlayLifes table...");
    await Cosmetic.addSpinWheelPlayLifesToAllUsers();

    // reset the play lifes table
    const Hemp = require('./models/Hemp');
    putil.log("app[cron]: Resetting the play record for 6 ending user in Hemp_TheDrink_PlayLifes...");
    await Hemp.resetTheDrinkPlayLifes();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

    console.error(err)

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
