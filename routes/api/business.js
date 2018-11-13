const express = require("express");
const router = express.Router();

// const Shuttle = require("../../models/Shuttle");
// const Trip = require("../../models/Trip");
const Advertiser = require("../../models/Advertiser");
const Business = require("../../models/Business");
const Image = require("../../models/Image");
const Jimp = require("jimp");

const validateBusinessInput = require("../../validation/business_val");

// router.get("/advertisers", (req, res) => {
//   // console.log("getting advertisers");
//   Advertiser.find()
//     .sort({ _id: 1 })
//     .then(advertisers => res.json(advertisers))
//     .catch(err => res.status(404).json({ nousersfound: "No shuttle found" }));
// });

router.get("/dojoin/:id/:ownid", (req, res) => {
  //Business.find({ sort: { ownerid: 1 } })
  let lu = {
    $lookup: {
      localField: "ownerid",
      from: "Advertiser",
      foreignField: "_id",
      as: "userinfo"
    }
  };
  let bizid = req.params.id;
  let ownerid = req.params.ownid;
  console.log("dojoin bizid " + bizid + " ownerid " + ownerid);
  //console.log("getting advertisements for id", id);
  //let query = { ownerid: id };

  let query = { _id: bizid };
  // let query = { _id: ownerid };
  let errors = {};
  Business.aggregate([
    {
      $lookup: {
        from: "advertisers",
        localField: "ownerid",
        foreignField: "_id",
        as: "advertiser"
      }
    },
    { $unwind: "$advertiser" }
  ])
    .exec()
    // Advertiser.aggregate([
    //   {
    //     $lookup: {
    //       from: "Business",
    //       localField: "_id",
    //       foreignField: "ownerid",
    //       as: "advertiser"
    //     }
    //   }
    // ])
    // Business.find(query, lu)
    // Advertiser.find(query)
    .then(data => {
      // console.log("all advertisements", advertisements);
      res.json(data);
    })
    .catch(err => {
      errors.message = "Problem with Businesses";
      return res.status(404).json(errors);
      // res.status(404).json({ nousersfound: "no ads found" });
    });
});

router.get("/businesses", (req, res) => {
  //Business.find({ sort: { ownerid: 1 } })
  let errors = {};
  Business.find()
    .sort({ ownerid: 1 })
    .then(data => {
      // console.log("all advertisements", advertisements);
      res.json(data);
    })
    .catch(err => {
      errors.message = "Problem with Businesses";
      return res.status(404).json(errors);
      // res.status(404).json({ nousersfound: "no ads found" });
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
  let query = { ownerid: id };
  Business.find(query)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(404).json({ message: "Cannot find business" }));
});

router.get("/allimages/:id", (req, res) => {
  let id = req.params.id;
  //console.log("getting advertisements for id", id);
  let query = { ownerid: id };
  Image.find(query)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(404).json({ message: "cannot get images" }));
});

router.get("/allphotos/:id", (req, res) => {
  let id = req.params.id;
  //console.log("getting advertisements for id", id);
  let query = { ownerid: id, type: "photo" };
  Image.find(query)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(404).json({ message: "cannot get photos" }));
});

//**************************
// CREATE BUSINESS
//**************************

router.post("/createBusiness", (req, res) => {
  const { errors, isValid } = validateBusinessInput(req.body);
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

  // Jimp.read(imageFile.data).then(lenna => {
  //   lenna
  //     .resize(200, Jimp.AUTO) // resize
  //     .quality(80); // set JPEG quality
  //     lenna.getBufferAsync(Jimp.MIME_JPEG).then(imagebuf => {
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
    ownerid: req.body.ownerid,
    status: req.body.status
  });
  newBusiness
    .save()
    .then(newBusiness => {
      // if (uploadimage) {
      Jimp.read(imageFile.data).then(lenna => {
        lenna
          .resize(200, Jimp.AUTO) // resize
          .quality(80); // set JPEG quality
        lenna.getBufferAsync(Jimp.MIME_JPEG).then(imagebuf => {
          const newImage = new Image({
            ownerid: newBusiness._id,
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
            // let rary = [];
            // rary.push(newBusiness);
            // rary.push(newi);
            // res.json(rary);
            let robj = {};
            robj.business = newBusiness;
            robj.image = newi;
            res.json(robj);
          });
        });
      });
      // } else {
      //   let rary = [];
      //   rary.push(newBusiness);
      //   rary.push(null);
      //   res.json(rary);
      // }
    })
    .catch(err => res.status(404).json({ message: "cannot create business" }));
});

//**************************
// MODIFY BUSINESS
//**************************
router.post("/modifyBusiness", (req, res) => {
  const { errors, isValid } = validateBusinessInput(req.body);
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
        let query = { ownerid: biz._id, type: "logo" };
        Jimp.read(imageFile.data)
          .then(lenna => {
            lenna
              .resize(200, Jimp.AUTO) // resize
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
  // const { errors, isValid } = validateBusinessInput(req.body);
  // // Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

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

  let ownerid = req.body.ownerid;
  let desc = req.body.description;
  //console.log("about to create image for ", filename);
  Jimp.read(imageFile.data)
    .then(lenna => {
      lenna
        .resize(200, Jimp.AUTO) // resize
        .quality(80); // set JPEG quality
      lenna.getBufferAsync(Jimp.MIME_JPEG).then(imagebuf => {
        const newImage = new Image({
          ownerid: ownerid,
          description: desc,
          owneremail: "owneremail",
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
  let query2 = { ownerid: id };
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
  let query2 = { ownerid: id, type: "logo" };
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

router.get("/trigger_error2", (req, res, next) => dispatch => {
  //console.log("in advertisers get delete-ad", req.params);
  let errors = {};
  let id = "123";
  let query = { _id: id };
  let query2 = { ownerid: id, type: "logo" };
  Business.findOne(query)
    .then(business => {
      res.json(business);
    })
    .catch(err => {
      console.log(err.response);
      errors.errormsg = "we have a major problem on the server";
      //res.locals.data = errors;
      //next(err);
      err.errors = errors;

      // console.log("we are triggering error 2 ", errors);
      // res.data = "now is the time for trouble";
      console.log("err errors", err.errors);
      res.status(302).json(err);
      //res.json(errors);
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