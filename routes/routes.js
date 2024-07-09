const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const passport = require('passport');

// Define your custom controller routing logic
router.post('/:Controller', (req, res) => {
  let controller = req.params.Controller;
  switch (controller) {
    case 'signUp': authController.signUp(req, res); break;
    case 'login': authController.login(req, res); break;
    default: res.status(404).send({ success: false, message: 'Controller not found' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {  scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback);



// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), authController.facebookCallback);


module.exports = router;