const router = require("express").Router();
const controllers = require("../controllers")
const auth = require("../Middleware/authentication");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Assets');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
 }
})
const upload = multer({ storage }).single('image')


router.post("/:Controller", auth, upload,(req, res) => {
    let controller = req.params.Controller;
    switch (controller) {
        case "createUrl": controllers.url.create(req, res); break;
        // case "getUrl": controllers.url.create(req, res); break;

 
    }
  });

  router.get("/:Controller",(req, res) => {
    let controller = req.params.Controller;
    switch (controller) {
        // case "createUrl": controllers.url.create(req, res); break;
        case "getall": controllers.url.getall(req, res); break;
        case "getallUser": controllers.url.getallUser(req, res); break;


 
    }
  });






module.exports = router;

