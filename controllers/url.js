const db = require("../model");
const moment = require('moment');
const fs = require('fs');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');

exports.getDate = () => {
  let date = new Date();
  date = moment(date).format('YYYY-MM-DD'); 
  return date;
}


const Bucketname = 'royalpatches-banners';
const aws_s3_bucket_id = 'AKIA4XRERNLJM2VVGAG7';
const aws_s3_bucket_secret = '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'; 
const public_URL = 'https://dbl4b5tdoapim.cloudfront.net/' ;






  const s3 = new AWS.S3();



exports.create = async (req, res) => {
  try {
      console.log({ controller: 'url', function: 'create' });
      let body = req.body
      let user = await db.ReactUser.findOne({ _id: req.user.id, is_verified: true , roles: "Admin" });
      if (!user) {
          return res.status(401).send({ success: false, message: 'Invalid User Request!' });
      }

      let existingRecord = await db.url.findOne({ 
          $or: [{ name: body.name }, { channel_url: body.channel_url }]
      });
      if (existingRecord) {
          return res.status(400).send({ success: false, message: 'Name or Channel URL already exists!' });
      }

      const params = {
        Bucket: Bucketname,
        Body: req.file.buffer,
        Key: req.file.originalname,
    };

  
    const AWS = require('aws-sdk');
     AWS.config.update({
        accessKeyId: aws_s3_bucket_id,
        secretAccessKey: aws_s3_bucket_secret,
        region: 'us-east-1'
    });
     const s3 = new AWS.S3();



     s3.upload(params, async (err, data) => {
      if (err) {
          res.status(500).send({ success: false, message: "Error uploading image to S3" });
      } else {

      let payload = {
        name: body.name,
        channel_url: body.channel_url,
        image: public_URL + data.Key,
        created_date: this.getDate(),
    };
    let tableData = await db.url(payload).save();
    if (tableData) {
        console.log({ tableData: tableData });
        res.status(200).send({ success: true, message: 'Record Saved Successfully!' });
    } else {
        res.status(500).send({ success: false, message: 'Failed to save record!' });
    }
       
      }
  });

  } catch (err) {
      res.status(500).send({ success: false, message: err.message });
  }
};


exports.getall = async (req, res) => {
  try {
      console.log({ controller: 'url', function: 'getAll' });
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 
      const skip = (page - 1) * limit;
      let user = await db.ReactUser.findOne({ _id: req.user.id, is_verified: true });
      if (!user) {
          return res.status(401).send({ success: false, message: 'Invalid User Request!' });
      }
      const totalUrls = await db.url.countDocuments();
      let urls = await db.url.find({}, { name: 1, channel_url: 1, image: 1, is_active : 1, created_date: 1 })
                              .sort({ _id: -1 })
                              .skip(skip)
                              .limit(limit);

      if (urls) {
          res.status(200).send({ 
              success: true, 
              message: urls,
              totalRecord: totalUrls,
              page: page,
              pages: Math.ceil(totalUrls / limit)
          });
      } else {
          res.status(500).send({ success: false, message: 'An error occurred in fetching URLs' });
      }
  } catch (err) {
      res.status(500).send({ success: false, message: err.message });
  }
};

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


  exports.delete = async (req, res) => {
    try {
      console.log({ controller: 'url', function: 'delete' });
      let user = await db.ReactUser.findOne({ _id: req.user.id, is_verified: true, roles: "Admin" });
      if (!user) {
        return res.status(401).send({ success: false, message: 'Invalid User Request!' });
      }
      let urlId = req.params.Id;
      console.log({  req :req.params.id})
      console.log( {  urlId : urlId})
      let existingRecord = await db.url.findOne({ _id: urlId });
      if (!existingRecord) {
        return res.status(404).send({ success: false, message: 'Record not found!' });
      }
      await db.url.deleteOne({ _id: urlId });
      res.status(200).send({ success: true, message: 'Record Deleted Successfully!' });
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  };

  exports.getOne = async (req, res) => {
    try {
      console.log({ controller: 'url', function: 'getOne' });
      let user = await db.ReactUser.findOne({ _id: req.user.id, is_verified: true, roles: "Admin" });
      if (!user) {
        return res.status(401).send({ success: false, message: 'Invalid User Request!' });
      }
      let urlId = req.params.Id;
      let existingRecord = await db.url.findOne({ _id: urlId });
      if (!existingRecord) {
        return res.status(404).send({ success: false, message: 'Record not found!' });
      }
      res.status(200).send({ success: true, data: existingRecord });
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  };


  exports.update = async (req, res) => {
    try {
      console.log({ controller: 'url', function: 'update' });
      let user = await db.ReactUser.findOne({ _id: req.user.id, is_verified: true, roles: "Admin" });
      if (!user) {
        return res.status(401).send({ success: false, message: 'Invalid User Request!' });
      }
      let body = req.body;
      let urlId = req.params.Id;
      let existingRecord = await db.url.findOne({ _id: urlId });
      if (!existingRecord) {
        return res.status(404).send({ success: false, message: 'Record not found!' });
      }
      let updatedRecord = await db.url.findOneAndUpdate(
        { _id: urlId },
        {
          name: body.name,
          channel_url: body.channel_url,
          image: req.file.originalname ? req.file.originalname : existingRecord.image,
          updated_date: this.getDate(),
        },
        { new: true }
      )
      if (updatedRecord) {
        res.status(200).send({ success: true, message: 'Record Updated Successfully!', data: updatedRecord });
      } else {
        res.status(500).send({ success: false, message: 'Failed to update record!' });
      }
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  };

  exports.toggleActiveStatus = async (req, res) => {
    try {
        console.log("toggleActiveStatus");
        let user = await db.ReactUser.findOne({ _id: req.user.id, is_verified: true, roles: "Admin" });
        if (user) {
            let id = req.query.Id;
            console.log(id);
            let urlDoc = await db.url.findOne({ _id: id });
            if (urlDoc) {
                let updatedUrl = await db.url.findOneAndUpdate(
                    { _id: id },
                    { is_active: !urlDoc.is_active },
                    { new: true }
                );

                if (updatedUrl) {
                    res.status(200).send({ success: true, message: "Updated Successfully!", data: updatedUrl });
                } else {
                    res.status(500).send({ success: false, message: 'An error occurred while updating the status' });
                }
            } else {
                res.status(404).send({ success: false, message: 'Document not found' });
            }
        } else {
            return res.status(401).send({ success: false, message: 'Invalid User Request!' });
        }
    } catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err.message });
    }
};
