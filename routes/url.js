const router = require("express").Router();
const controllers = require("../controllers")
const auth = require("../Middleware/authentication");
// const multer = require('multer');

const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


router.post("/:Controller", auth, upload.single('image'),(req, res) => {
    let controller = req.params.Controller;
    switch (controller) {
        case "createUrl": controllers.url.create(req, res); break;
        case "getall": controllers.url.getall(req, res); break;
        case "getallUser": controllers.url.getallUser(req, res); break;
        case "toggleActiveStatus": controllers.url.toggleActiveStatus(req, res); break;

     

    }
  });

  router.post("/:Controller/:Id", auth, upload.single('image'), (req, res) => {
    let controller = req.params.Controller;
    switch (controller) {
      case "updateChannel": controllers.url.update(req, res); break;
      case "deleteChannel": controllers.url.delete(req, res); break;   
      case "getone": controllers.url.getOne(req, res); break; 
    }
  });
  


  // router.get("/:Controller",(req, res) => {
  //   let controller = req.params.Controller;
  //   switch (controller) {
       
       


 
  //   }
  // });






module.exports = router;

