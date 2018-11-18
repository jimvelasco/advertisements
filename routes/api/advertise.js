const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// const Shuttle = require("../../models/Shuttle");
// const Trip = require("../../models/Trip");
const Advertiser = require("../../models/Advertiser");
const Advertisement = require("../../models/Advertisement");
const Image = require("../../models/Image");
const Jimp = require("jimp");

const validateAdvertisementInput = require("../../validation/advertisement");

// this is used in AdverDetails
// not active at the moment
router.get("/get-images/:id", (req, res) => {
  let id = req.params.id;
  let query = { advertiserId: id, type: "logo" };
  Image.findOne(query)
    .then(data => {
      // dispatch({ type: SET_CURRENT_ADVERTISEMENTs, payload: advertisements });
      res.json(data);
    })
    .catch(err => res.status(404).json({ message: "Problem getting images" }));
});

// USED BY ADMIN TO GET LIST OF ALL ADVERTISERS

router.get("/advertisers", (req, res) => {
  // console.log("getting advertisers");
  Advertiser.find()
    .then(advertisers => res.json(advertisers))
    .catch(err => res.status(404).json({ message: "No Advertisers Found" }));
});

router.get("/advertisements/:id", (req, res) => {
  let id = req.params.id;
  //let query = { businessId: id };
  //console.log("advertise api", query);

  let query = { businessId: ObjectId(id) };

  Advertisement.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "advertisementId",
        as: "image"
      }
    },
    { $unwind: "$image" },
    { $match: { "image.type": "ad" } }
  ])

    //Advertisement.find(query)
    .then(advertisements => {
      //console.log("all advertisements", advertisements);
      res.json(advertisements);
    })
    .catch(err => res.status(404).json({ message: "no advertisements found" }));
});

router.get("/advertisements_api", (req, res) => {
  Advertiser.find()
    .then(advertisements => res.json(advertisements))
    .catch(err => res.status(404).json({ message: "no ads found" }));
});

router.post("/createAdvertisement", (req, res) => {
  const { errors, isValid } = validateAdvertisementInput(req.body);
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
    errors.message = "You must provide an advertisement image";
    return res.status(400).json(errors);
  }

  const newAd = new Advertisement({
    advertiserId: req.body.advertiserId,
    businessId: req.body.businessId,
    name: req.body.name,
    description: req.body.description,
    discount: req.body.discount,
    type: req.body.type,
    category: req.body.category,
    status: 0,
    child: 3
  });

  //console.log("new advertisement", newAd);

  newAd
    .save()
    .then(newAd => {
      Jimp.read(imageFile.data).then(lenna => {
        lenna
          .resize(200, Jimp.AUTO) // resize
          .quality(80); // set JPEG quality
        lenna.getBufferAsync(Jimp.MIME_JPEG).then(imagebuf => {
          const newImage = new Image({
            advertiserId: newAd.advertiserId,
            businessId: newAd.businessId,
            advertisementId: newAd._id,
            owneremail: "newad_email",
            type: "ad",
            category: "",
            imageBuffer: imagebuf,
            imageFilename: filename,
            width: lenna.bitmap.width,
            height: lenna.bitmap.height,
            child: 3
          });
          newImage.save().then(newi => {
            let robj = {};
            robj.ad = newAd;
            robj.image = newi;
            res.json(robj);
          });
        });
      });
    })
    .catch(err =>
      res.status(404).json({ message: "Create Advertisement Unsuccessful" })
    );
});

router.post("/modifyAdvertisement", (req, res) => {
  const { errors, isValid } = validateAdvertisementInput(req.body);
  // Check Validation

  if (!isValid) {
    return res.status(400).json(errors);
  }
  let id = req.body.advertisementId;
  let query = { _id: id };
  var options = { new: true };

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
    discount: req.body.discount,
    description: req.body.description
  };

  let returnobj = { ad: null, img: null };

  let imagequery = { advertisementId: id, type: "ad" };

  Advertisement.findOneAndUpdate(query, updateobj, options)
    .then(newAd => {
      returnobj.ad = newAd;
      if (modifyimage) {
        Jimp.read(imageFile.data)
          .then(lenna => {
            lenna
              .resize(200, Jimp.AUTO) // resize
              .quality(80);
            lenna.getBufferAsync(Jimp.MIME_JPEG).then(buf => {
              var options = { new: true };
              let updateobj = {
                imageBuffer: buf,
                imageFilename: filename,
                width: lenna.bitmap.width,
                height: lenna.bitmap.height
              };

              Image.findOneAndUpdate(imagequery, updateobj, options).then(
                img => {
                  returnobj.img = img;
                  return res.json(returnobj);
                }
              );
            });
          })
          .catch(err =>
            res.status(404).json({ message: "cannot modify business" })
          );
      } else {
        res.json(returnobj);
      }
    })
    .catch(err =>
      res.status(404).json({ message: "Modify Advertisement Unsuccessful" })
    );
});

router.get("/delete-advertisement/:id", (req, res) => {
  //console.log("in advertise get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  let query2 = { advertisementId: id };
  Advertisement.deleteOne(query)
    .then(advertisement => {
      Image.deleteMany(query2)
        .then(di => {
          res.json(di);
        })
        .catch(err =>
          res.status(404).json({ message: "Problem Deleting Image" })
        );
    })
    .catch(err =>
      res.status(404).json({ message: "Delete Advertisement Unsuccessful" })
    );
});

// router.get("/delete-advertiser/:id", (req, res) => {
//   console.log("in advertise get delete-advertiser", req.params);
//   let id = req.params.id;
//   let query = { _id: id };
//   let query2 = { ownerid: id };
//   Advertiser.deleteOne(query)
//     .then(rid => res.json(query))
//     .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
// });

router.get("/delete-advertiser/:id", (req, res) => {
  //console.log("in advertise get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  let query2 = { advertiserId: id };
  Advertiser.deleteOne(query)
    .then(biz => {
      Business.deleteMany(query2)
        .then(di => {
          Image.deleteMany(query2)
            .then(di => {
              res.json(di);
            })
            .catch(err =>
              res.status(404).json({ message: "Problem Deleting Image" })
            );
        })
        .catch(err =>
          res.status(404).json({ message: "Problem Deleting Businesses" })
        );
    })
    .catch(err =>
      res.status(404).json({ message: "Problem Deleting Advertiser" })
    );
});

// new play area

router.get("/change-advertiser-status/:id/:status", (req, res) => {
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

  Advertiser.findOneAndUpdate(query, updateobj, options)
    .then(function(advertiser) {
      return res.json(advertiser);
    })
    .catch(err =>
      res.status(404).json({ message: "Problem changing advertiser status" })
    );
});

// let link = `/api/advertise/change-advertisement-status/${adid}/${status}`;

router.get("/change-advertisement-status/:id/:status", (req, res) => {
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

  Advertisement.findOneAndUpdate(query, updateobj, options)
    .then(advertisement => {
      return res.json(advertisement);
    })
    .catch(err =>
      res.status(404).json({ message: "advertisement update status failed" })
    );
});

// end play area

router.get("/find-ad/:id", (req, res) => {
  //console.log("in advertisers get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  Advertisement.find(query)
    .then(advertisement => res.json(advertisement))
    .catch(err =>
      res.status(404).json({ message: "Problem finding advertisement" })
    );
});

router.get("/doadimagejoin/:id", (req, res) => {
  let id = req.params.id;
  //let query = { businessId: id };
  //console.log("advertise api", query);

  let query = { businessId: ObjectId(id) };
  //let query = { businessId: id };

  Advertisement.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "advertisementId",
        as: "image"
      }
    },
    { $unwind: "$image" },
    { $match: { "image.type": "ad" } }
  ]).then(ads => {
    res.json(ads);
  });
});

// let imgquery = {};
// let modads = [];

// const curs = Advertisement.find(query).cursor();
// // curs.each(ad => {
// console.log("cursor", curs);
// // });
// // .forEach(ad => {
// //   ad.img = Image.findOne({ advertisementId: ad._id, type: "ad" });
// //   modads.push(ad);
// // });
// //console.log(curs);
// console.log("%%%%%%%%%%%%%%%%%%%%%");

// // res.json(modads);

// Advertisement.find(query)
//   .then(ads => {
//     console.log("all advertisements", ads);
//     ads.forEach(obj => {
//       imgquery.advertisementId = obj._id;
//       imgquery.type = "ad";
//       console.log(imgquery);
//       Image.findOne(imgquery).then(im => {
//         // console.log("************");
//         // console.log("ad object id", obj._id);
//         console.log("imgage advertisement id", im.advertisementId);
//         //console.log(im);
//         console.log("---------");
//         obj.discount = im.height;
//         modads.push(obj);
//         // console.log("modads", modads);
//       });
//     });
//     res.json(ads);
//   })
//   .catch(err => res.status(404).json({ message: "no advertisements found" }));

//});

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
