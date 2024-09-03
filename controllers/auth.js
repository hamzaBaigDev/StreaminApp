const db = require("../model");
const jwt = require('jsonwebtoken');
const jwtkey = 'e-comm';
const moment = require('moment');

exports.getDate = () => {
  let date = new Date();
  date = moment(date).format('YYYY-MM-DD'); 
  return date;
}

exports.signUp = async (req, res) => {
  try {
    console.log({ controller: 'Signup', function: 'Signup' });
    let body = req.body;
    console.log({ Request: req.body });
    body.email = body.email.toLowerCase();
    let doc = await db.ReactUser.findOne({ email: body.email });
    if (doc) {
      res.status(500).send({ success: false, message: 'User already exists' });
    } else {
      let payload = {
        name: body.name,
        email: body.email,
        password: body.password,
        is_verified: true,
        created_date: this.getDate(),
        roles: "User"
      }
      let result = await new db.ReactUser(payload).save();
      if (result) {
        res.status(200).send({ message: "Record successfully saved" });
      } else {
        res.status(500).send({ success: false, message: "Error saving record" });
      }
    }
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
}

exports.login = async (req, res) => {
  try {
    console.log({ controller: "SigninREact", function: "Login" });
    console.log(req.body);

    if (req.body.password && req.body.email) {
      let user = await db.ReactUser.findOne({ email: req.body.email });

      if (user) {
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
          return res.status(400).send({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, jwtkey, { expiresIn: "2h" });
        user.authToken = token;
        await user.save();

        res.status(200).send({ user: { id: user._id, email: user.email , roles : user.roles }, auth: token });
      } else {
        res.status(400).send({ success: true, message: 'No User Found' });
      }
    } else {
      res.status(400).send({ success: false, message: 'Email and password are required' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: err.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, jwtkey, { expiresIn: "2h" });
    user.authToken = token;
    await user.save();

    res.status(200).send({ user: { id: user._id, email: user.email , roles : user.roles }, auth: token });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};


exports.facebookCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, jwtkey, { expiresIn: "2h" });
    user.authToken = token;
    await user.save();

    res.status(200).send({ user: { id: user._id, email: user.email , roles : user.roles }, auth: token });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
