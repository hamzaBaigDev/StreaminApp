const db = require("../model");
const moment = require('moment');

exports.getDate = () => {
  let date = new Date();
  date = moment(date).format('YYYY-MM-DD'); // Assuming dateFormat is 'YYYY-MM-DD'
  return date;
}

exports.create = async (req, res) => {
  try {
      console.log({ controller: 'url', function: 'create' });
      
      // Verify user
      let user = await db.ReactUser.findOne({ _id: req.user.id, is_verified: true , roles: "Admin" });
      if (!user) {
          return res.status(401).send({ success: false, message: 'Invalid User Request!' });
      }

      let body = req.body;
      console.log(req.body);

    
      let existingRecord = await db.url.findOne({ 
          $or: [{ name: body.name }, { channel_url: body.channel_url }]
      });
      
      if (existingRecord) {
          return res.status(400).send({ success: false, message: 'Name or Channel URL already exists!' });
      }

      let payload = {
          name: body.name,
          channel_url: body.channel_url,
          image: req.file.originalname,
          created_date: this.getDate(),
      };

      let tableData = await db.url(payload).save();
      console.log(tableData);

      if (tableData) {
          console.log({ tableData: tableData });
          res.status(200).send({ success: true, message: 'Record Saved Successfully!' });
      } else {
          res.status(500).send({ success: false, message: 'Failed to save record!' });
      }
  } catch (err) {
      res.status(500).send({ success: false, message: err.message });
  }
};


  exports.getall = async (req, res) => {
    try {
      console.log({ controller: 'url', function: 'getAll' });
      let urls = await db.url.find({}, {  name: 1 ,channel_url: 1 , image :1 , created_date : 1 }).sort({ _id: -1 }); 
      if (urls) {
        res.status(200).send({ success: true, message: urls });
      } else {
        res.status(500).send({ success: false, message: 'An error occurred in urls' });
      }
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }




  exports.getallUser = async (req, res) => {
    try {
      console.log({ controller: 'url', function: 'getallUser' });
  
    
      let users = await db.ReactUser.find(
        { roles: { $ne: 'Admin' } }, 
        { name:  1 , email : 1 ,is_verified : 1 ,roles : 1 }, 
        
            

      ).sort({ _id: -1 });
  
      if (users) {
        res.status(200).send({ success: true, message: users });
      } else {
        res.status(500).send({ success: false, message: 'An error occurred in retrieving users' });
      }
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  };