const express = require("express");
const session = require("express-session");
const cors = require("cors");
const compression = require('compression');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const routes = require('./routes');
const connectDB = require('./controllers/db');
const db = require('./model'); 
const jwt = require('jsonwebtoken');
const port = 3000;

const app = express();

// Connect Database
connectDB();

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(cors());
app.use(compression());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Expose-Headers", "build");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, PATCH, OPTIONS HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    secret:'test.123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 } // 24 * 60 * 60 * 1000 =  24 Hours
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// google Strategy

passport.use(new GoogleStrategy({
  clientID: '1037529190781-qjo6qpl98i89obulmmphpu1pd0oa88d0.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/v1/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await db.ReactUser.findOne({ email: profile.emails[0].value.toLowerCase() });
    if (!user) {
      user = await new db.ReactUser({
        name: profile.displayName,
        email: profile.emails[0].value.toLowerCase(),
        is_verified: true,
        created_date: new Date(),
        roles: "User",
        Channel : "google"
      }).save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));


// Facebook Strategy

passport.use(new FacebookStrategy({
  clientID: '3483521511907626',
  clientSecret: 'cf0ca3faec1e36a9280a7302e7bace99',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await db.ReactUser.findOne({ email: profile.emails[0].value.toLowerCase() });
    if (!user) {
      user = await new db.ReactUser({
        name: profile.name.givenName + ' ' + profile.name.familyName,
        email: profile.emails[0].value.toLowerCase(),
        is_verified: true,
        created_date: new Date(),
        roles: "User"
      }).save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));




passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.ReactUser.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
app.use("/v1/auth", routes.signUp); // Adjusted route
app.use("/v1/url", routes.url);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});