const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const ObjectID = require("mongodb").ObjectID;

// const Shuttle = require("../../models/Shuttle");
// const Trip = require("../../models/Trip");
const Advertiser = require("../../models/Advertiser");
const Business = require("../../models/Business");
const Image = require("../../models/Image");
const Jimp = require("jimp");

const photoHelper = require("../../config/photoHelper");

const validateBusinessInput = require("../../validation/business_val");
const validateBusinessImageInput = require("../../validation/business_image");

router.get("/businesses", (req, res) => {
  let errors = {};
  // Business.find()
  //   .sort({ advertiserId: 1 })
  Business.aggregate([
    {
      $lookup: {
        from: "advertisers",
        localField: "advertiserId",
        foreignField: "_id",
        as: "advertiser"
      }
    },
    { $unwind: "$advertiser" }
  ])
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      errors.message = "Problem with Businesses";
      return res.status(404).json(errors);
    });
});

router.get("/business_map", (req, res) => {
  let errors = {};
  // Business.find()
  //   .sort({ advertiserId: 1 })

  Business.aggregate([
    {
      $lookup: {
        from: "advertisements",
        localField: "_id",
        foreignField: "businessId",
        as: "ads"
      }
    }
    // ,
    // { $unwind: "$ads" }
  ])
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      errors.message = "Problem with Businesses";
      return res.status(404).json(errors);
    });
});

// router.get("/advertisements_api", (req, res) => {
//   Advertiser.find()
//     .then(advertisements => res.json(advertisements))
//     .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
// });

router.get("/businesses/:id", (req, res) => {
  let id = req.params.id;
  //console.log("getting advertisements for id", id);
  let query = { advertiserId: ObjectId(id) };
  // Business.find(query)
  Business.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "advertisers",
        localField: "advertiserId",
        foreignField: "_id",
        as: "advertiser"
      }
    },
    { $unwind: "$advertiser" }
  ])
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(404).json({ message: "Cannot find business" }));
});

// router.get("/allimages/:id", (req, res) => {
//   let id = req.params.id;
//   //console.log("getting advertisements for id", id);
//   let query = { ownerid: id };
//   Image.find(query)
//     .then(data => {
//       res.json(data);
//     })
//     .catch(err => res.status(404).json({ message: "cannot get images" }));
// });

router.get("/allphotos/:id", (req, res) => {
  let id = req.params.id;
  //console.log("getting advertisements for id", id);
  let query = { businessId: id, type: "photo" };
  Image.find(query)
    .then(data => {
      // console.log("all photos", data);
      res.json(data);
    })
    .catch(err => res.status(404).json({ message: "cannot get photos" }));
});

//**************************
// CREATE BUSINESS
//**************************

router.post("/createBusiness", (req, res) => {
  const { errors, isValid } = validateBusinessInput(req.body);
  const lwidth = photoHelper.logoWidth;
  let lheight = photoHelper.logoHeight;
  if (lheight == -1) {
    lheight = Jimp.AUTO;
  }
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let noimageavail = true;
  let imageFile = null;
  let filename = "now is the time";
  if (req.files) {
    noimageavail = false;
    imageFile = req.files.file;
    filename = imageFile.name;
  }
  if (noimageavail) {
    let errors = {};
    errors.message = "You must provide a logo image";
    return res.status(400).json(errors);
  }

  let adverid = req.body.advertiserId;

  Advertiser.find({ _id: adverid })
    .then(adver => {
      const newBusiness = new Business({
        name: req.body.name,
        email: req.body.email,
        description: req.body.description,
        category: req.body.category,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        advertiserId: adverid,
        advertiser: adver,
        status: req.body.status
      });
      newBusiness
        .save()
        .then(newBusiness => {
          // if (uploadimage) {
          Jimp.read(imageFile.data).then(lenna => {
            lenna
              //.resize(200, Jimp.AUTO) // resize
              .resize(lwidth, lheight) // resize
              .quality(80); // set JPEG quality
            lenna.getBufferAsync(Jimp.MIME_JPEG).then(imagebuf => {
              const newImage = new Image({
                advertiserId: newBusiness.advertiserId,
                businessId: newBusiness._id,
                owneremail: req.body.owneremail,
                type: "logo",
                category: "",
                imageBuffer: imagebuf,
                imageFilename: filename,
                width: lenna.bitmap.width,
                height: lenna.bitmap.height,
                child: 1
              });
              newImage.save().then(newi => {
                let robj = {};
                robj.business = newBusiness;
                robj.image = newi;
                res.json(robj);
              });
            });
          });
        })
        .catch(err =>
          res.status(404).json({ message: "cannot create business" })
        );
    })
    .catch(err => res.status(404).json({ message: "cannot create business" }));
});

//**************************
// MODIFY BUSINESS
//**************************
router.post("/modifyBusiness", (req, res) => {
  const { errors, isValid } = validateBusinessInput(req.body);
  const lwidth = photoHelper.logoWidth;
  let lheight = photoHelper.logoHeight;
  if (lheight == -1) {
    lheight = Jimp.AUTO;
  }

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let id = req.body.id;
  let query = { _id: id };

  var options = { new: true };

  //Advertisement.find(query)

  let modifyimage = false;
  let imageFile = null;
  let filename = "now is the time";

  if (req.files) {
    modifyimage = true;
    imageFile = req.files.file;
    filename = imageFile.name;
  }

  const updateobj = {
    name: req.body.name,
    email: req.body.email,
    description: req.body.description,
    category: req.body.category,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    longitude: req.body.longitude,
    latitude: req.body.latitude
    // ownerid: req.body.ownerid,
    // status: req.body.status
  };

  Business.findOneAndUpdate(query, updateobj, options)
    .then(biz => {
      if (modifyimage) {
        let query = { businessId: biz._id, type: "logo" };
        Jimp.read(imageFile.data)
          .then(lenna => {
            lenna
              .resize(lwidth, lheight) // resize
              .quality(80);
            lenna.getBufferAsync(Jimp.MIME_JPEG).then(buf => {
              var options = { upsert: true, returnNewDocument: true };
              let updateobj = {
                imageBuffer: buf,
                imageFilename: filename,
                width: lenna.bitmap.width,
                height: lenna.bitmap.height
              };
              // Advertiser.findOneAndUpdate(query, updateobj, options)
              Image.findOneAndUpdate(query, updateobj, options).then(newAd => {
                return res.json(newAd);
              });
            });
          })
          .catch(err =>
            res.status(404).json({ message: "cannot modify business" })
          );
      } else {
        res.json(biz);
      }
    })
    .catch(err => res.status(404).json({ message: "cannot modify business" }));
});

//**************************
// CREATE IMAGE
//**************************

router.post("/createImage", (req, res) => {
  const { errors, isValid } = validateBusinessImageInput(req.body);
  const pwidth = photoHelper.photoWidth;
  let pheight = photoHelper.photoHeight;
  if (pheight == -1) {
    pheight = Jimp.AUTO;
  }

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //console.log("we are in business api createImage");

  let noimageavail = true;
  let imageFile = null;
  let filename = "now is the time";

  if (req.files) {
    noimageavail = false;
    imageFile = req.files.file;
    filename = imageFile.name;
  }

  //console.log("no image available", noimageavail);

  if (noimageavail) {
    let errors = {};
    errors.message = "You must provide a logo image";
    return res.status(400).json(errors);
  }

  let businessId = req.body.businessId;
  let advertiserId = req.body.advertiserId;
  let desc = req.body.description;
  //console.log("about to create image for ", filename);
  Jimp.read(imageFile.data)
    .then(lenna => {
      lenna
        .resize(pwidth, pheight) // resize
        .quality(80); // set JPEG quality
      lenna.getBufferAsync(Jimp.MIME_JPEG).then(imagebuf => {
        const newImage = new Image({
          advertiserId: advertiserId,
          businessId: businessId,
          description: desc,
          owneremail: "",
          type: "photo",
          category: "",
          imageBuffer: imagebuf,
          imageFilename: filename,
          width: lenna.bitmap.width,
          height: lenna.bitmap.height,
          child: 2
        });
        newImage.save().then(newi => {
          res.json(newi);
        });
      });
    })
    .catch(err => res.status(404).json({ message: "cannot create image" }));
});

router.get("/deletePhoto/:id", (req, res) => {
  //console.log("in advertise get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  Image.deleteOne(query)
    .then(di => {
      res.json(di);
    })
    .catch(err => res.status(404).json({ message: "Problem Deleting Image" }));
});

router.get("/delete-business/:id", (req, res) => {
  //console.log("in advertise get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  let query2 = { businessId: id };
  Business.deleteOne(query)
    .then(biz => {
      Image.deleteMany(query2)
        .then(di => {
          res.json(biz);
        })
        .catch(err =>
          res.status(404).json({ message: "Problem Deleting Images" })
        );
    })
    .catch(err =>
      res.status(404).json({ message: "Problem Deleting Business" })
    );
});

router.get("/change-business-status/:id/:status", (req, res) => {
  //console.log("in advertisers get change-advertiser-status", req.params);
  let id = req.params.id;
  let curstat = req.params.status;
  let updatestat = 0;
  if (curstat == "0") {
    updatestat = 1;
  }
  let query = { _id: id };

  var updateobj = { status: updatestat };
  var options = { new: true };

  Business.findOneAndUpdate(query, updateobj, options)
    .then(advertisement => {
      return res.json(advertisement);
    })
    .catch(err =>
      res.status(404).json({ message: "cannot change business status" })
    );
});

router.get("/find-business/:id", (req, res) => {
  //console.log("in advertisers get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  let query2 = { businessId: id, type: "logo" };
  Business.findOne(query)
    .then(business => {
      Image.findOne(query2)
        .then(img => {
          let rary = [];
          rary.push(business);
          rary.push(img);
          res.json(rary);
        })
        .catch(err =>
          res.status(404).json({ message: "cannot find business" })
        );
    })
    .catch(err => res.status(404).json({ message: "cannot find business" }));
});

router.get("/trigger_error", (req, res) => {
  //console.log("in advertisers get delete-ad", req.params);
  let errors = {};
  let id = "123";
  let query = { _id: id };
  Business.findOne(query)
    .then(business => {
      res.json(business);
    })
    .catch(err => {
      errors.message = "we have a major problem";
      //console.log("we are triggering error ", errors);
      res.status(404).json(errors);
    });
});

// router.get("/delete-advertiser/:id", (req, res) => {
//   console.log("in advertise get delete-advertiser", req.params);
//   let id = req.params.id;
//   let query = { _id: id };
//   Advertiser.deleteOne(query)
//     .then(rid => res.json(query))
//     .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
// });

// // new play area

// router.get("/change-advertiser-status/:id/:status", (req, res) => {
//   //console.log("in advertisers get change-advertiser-status", req.params);
//   let id = req.params.id;
//   let curstat = req.params.status;
//   let updatestat = 0;
//   if (curstat == "0") {
//     updatestat = 1;
//   }
//   let query = { _id: id };

//   var updateobj = { status: updatestat };
//   var options = { new: true };

//   Advertiser.findOneAndUpdate(query, updateobj, options)
//     .then(function(advertiser) {
//       return res.json(advertiser);
//     })
//     .catch(err =>
//       res.status(404).json({ nousersfound: "no advertiser found" })
//     );
// });

// end play area

// async function deleteInventory(token, inventoryObjId) {
//   //console.log("inventory services deleteInventory", inventoryObjId);
//   //console.log("inventory services deleteInventory token", token);

//   const apiObject = {};
//   apiObject.method = "GET";
//   apiObject.authentication = token;
//   apiObject.body = inventoryObjId;
//   apiObject.endpoint = `api/admin/del_inventory?inventoryObjId=${inventoryObjId}`;
//   const response = await ApiService.callApi(apiObject);
//   return response;
// }

// methods to support trips
// no form for create trip yet

// router.get("/triptest", (req, res) => res.json({ msg: "trip works" }));

// router.post("/newtrip", (req, res) => {
//   const newTrip = new Trip({
//     shuttlename: req.body.shuttlename,
//     driver: req.body.driver,
//     guestname: req.body.guestname,
//     property: req.body.property,
//     roomnum: req.body.roomnum,
//     pickuploc: req.body.pickuploc,
//     numpassengers: req.body.numpassengers,
//     pickuptime: req.body.pickuptime,
//     dropoffloc: req.body.dropoffloc,
//     booktime: req.body.booktime,
//     status: req.body.status
//   });

//   newTrip
//     .save()
//     .then(trip => res.json(trip))
//     .catch(err => console.log(err));
// });

// router.get("/trips", (req, res) => {
//   Trip.find()
//     .then(trips => res.json(trips))
//     .catch(err => res.status(404).json({ nousersfound: "No trips found" }));
// });

module.exports = router;
