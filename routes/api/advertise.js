const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { MongoClient } = require("mongodb");

// const Shuttle = require("../../models/Shuttle");
// const Trip = require("../../models/Trip");
const Advertiser = require("../../models/Advertiser");
const Advertisement = require("../../models/Advertisement");
const Image = require("../../models/Image");
const Jimp = require("jimp");

//const ReactDOMServer = require("react-dom/server");

const validateAdvertisementInput = require("../../validation/advertisement");

//const Advertisers = require("../../client/src/components/advertisers/Advertisers");

// router.get("/webservice", (req, res) => {
//   //const ad = <Advertisers />;
//   const data = ReactDOMServer.renderToString(Advertisers);
//   res.send(data);
// });
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

//**********************/
// dispatch api stuff
//**********************/
router.get("/dispatch_api", (req, res) => {
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
  ])
    .then(data => {
      let rary = [];

      let dlen = data.length;
      let dcnt = 0;
      data.forEach(function(obj) {
        dcnt = dcnt + 1;
        // console.log("dcnt", dcnt);
        let rdata = {};
        rdata["name"] = obj["name"];
        rdata["description"] = obj["description"];
        let ads = obj["ads"];
        let imgary = [];
        let numads = ads.length;
        let cnt = 0;
        ads.forEach(function(ad) {
          let advertisementid = ad["_id"];
          let query = { advertisementId: advertisementid };
          //console.log("query is ", query, cnt, numads);
          imgary.push(query);

          // Image.findOne(query)
          //   .then(idata => {
          //     cnt = cnt + 1;
          //     let fname = idata["imageFilename"];
          //     imgary.push(fname);
          //     console.log("imgary is", imgary);
          //   })
          //   .catch(err => {
          //     errors.message = "Problem with Businesses";
          //     //return res.status(404).json(errors);
          //   });
        });

        rdata["ads"] = imgary;
        rary.push(rdata);
        console.log("done looping rdata is ", dcnt, rdata);
        //console.log("dobj cnt cnt ", dlen, dcnt);
        // if (dcnt == dlen) {
        //   res.json(rary);
        // }
      });
      res.json(rary);
    })
    .catch(err => {
      errors.message = "Problem with Businesses";
      return res.status(404).json(errors);
    });
});

router.get("/dispatch_cursor", async (req, res) => {
  let results = await Business.find();
  // Use `next()` and `await` to exhaust the cursor
  let bizary = [];
  let adary = [];
  let imgary = [];

  console.log("business *********************");
  results.forEach(async function(biz) {
    //console.log(biz);
    bizary.push(biz);
    let query = { businessId: biz._id };
    let ads = await Advertisement.find(query);
    console.log("ad *********************");
    ads.forEach(async function(ad) {
      //console.log(ad);
      adary.push(ad);
      let query2 = { advertisementId: ad._id };
      let imgs = await Image.find(query);
      console.log("img *********************");
      imgs.forEach(async function(img) {
        imgary.push(img.imageFilename);

        // console.log(img.imageFilename);
      });
      console.log("-----------------------");
      console.log("we are all done");
      console.log("biz", bizary);
      console.log("ad", adary);
      console.log("img", imgary);
      let rr = [];
      rr.push({ biz: bizary });
      rr.push({ ad: adary });
      rr.push({ img: imgary });
      res.json(rr);
    });
  });

  //console.log(cursor.hasNext());

  // while (cursor.hasNext()) {
  // const doc = await cursor.next();
  // console.log(doc);
  // // }

  // cursor.forEach(function(race) {
  //   console.log(race);
  // });

  // cursor.on("data", function(doc) {
  //   console.log("business *********************");
  //   console.log(doc);
  //   let query = { businessId: doc._id };
  //   const cursor2 = Advertisement.find(query).cursor();
  //   cursor2.on("data", function(ad) {
  //     console.log("ad *********************");
  //     console.log(ad);
  //   });
  // });
  // console.log(cursor.next);
  // cursor.next.then(doc => {
  //   console.log(doc);
  // });
  // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  //   console.log(doc.name);
  // }
});

router.get("/dispatch_api_raw", (req, res) => {
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
  ])
    .then(data => {
      let rary = [];
      let rdata = {};
      data.forEach(function(obj) {
        rdata["name"] = obj["name"];
        rary.push(rdata);
      });
      res.json(data);
    })
    .catch(err => {
      errors.message = "Problem with Businesses";
      return res.status(404).json(errors);
    });
});

// let id = req.params.id;
// let query = {};
// Advertisement.aggregate([
//   { $match: query },
//   {
//     $lookup: {
//       from: "images",
//       localField: "_id",
//       foreignField: "advertisementId",
//       as: "image"
//     }
//   },
//   { $unwind: "$image" },
//   { $match: { "image.type": "ad" } }
//   .then(advertisements => {
//     res.json(advertisements);
//   })
//   .catch(err => res.status(404).json({ message: "no advertisements found" }));

//**********************/
// end dispatch api stuff
//**********************/

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
    startdate: req.body.startdate,
    enddate: req.body.enddate,
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
    description: req.body.description,
    startdate: req.body.startdate,
    enddate: req.body.enddate
  };
  // console.log("api modify adverrisement ", updateobj);

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

router.get("/xxdoadimagejoin/:id", (req, res) => {
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

router.get("/ccccdoadimagejoin/:id", (req, res) => {
  let id = req.params.id;
  //let query = { businessId: id };
  console.log("advertise api bizid ", id);

  let query = { _id: ObjectId(id) };
  //let query = { businessId: id };

  Business.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "advertisements",
        localField: "_id",
        foreignField: "businessId",
        as: "adverts"
      }
    },

    {
      $lookup: {
        from: "images",
        localField: "advertisementId",
        foreignField: "advertisementId",
        as: "imageads"
      }
    },
    { $unwind: "$adverts" },
    { $unwind: "$imageads" },

    { $match: { "imageads.type": "ad" } }
  ]).then(ads => {
    res.json(ads);
  });
});

router.get("/thisisgood_doadimagejoin/:id", (req, res) => {
  let id = req.params.id;
  //let query = { businessId: id };
  console.log("advertise api bizid ", id);
  let query = { businessId: ObjectId(id), type: "ad" };
  Image.aggregate([
    { $match: query },

    {
      $lookup: {
        from: "advertisements",
        localField: "advertisementId",
        foreignField: "_id",
        as: "adverts"
      }
    },
    { $unwind: "$adverts" },

    {
      $lookup: {
        from: "businesses",
        localField: "businessId",
        foreignField: "_id",
        as: "bizes"
      }
    },
    { $unwind: "$bizes" },
    {
      $project: {
        imageFilename: 1,
        type: 1,
        "adverts.name": 1,
        "bizes.description": 1
      }
    }
  ]).then(ads => {
    res.json(ads);
  });
});

router.get("/bizdata_api", (req, res) => {
  let id = req.params.id;
  //let query = { businessId: id };
  //console.log("advertise api bizid ", id);
  let query = { category: "seafood" }; // businessId: ObjectId(id), type: "ad" };

  Business.aggregate([
    // { $match: query },

    // Advertiser.aggregate([
    //   { $match: query },

    {
      $lookup: {
        from: "advertisers",
        let: { advertiser_id: "$advertiserId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$advertiser_id"] }]
              }
            }
          }
        ],
        as: "advertiser"
      }
    },
    // { $unwind: "$advertiser" },

    {
      $lookup: {
        from: "advertisements",
        let: { biz_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$businessId", "$$biz_id"] }]
              }
            }
          }
        ],
        as: "advertisements"
      }
    },
    { $unwind: "$advertisements" },

    // {
    //   $lookup: {
    //     from: "images",
    //     let: { ad_id: "$adverts._id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               { $eq: ["$advertisementId", "$$ad_id"] },
    //               { $eq: ["$type", "ad"] }
    //             ]
    //           }
    //         }
    //       }
    //     ],
    //     as: "imgs"
    //   }
    // },
    // { $unwind: "$imgs" },

    {
      $lookup: {
        from: "images",
        let: { biz_id: "$_id", advertiserId: "$advertisements._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$businessId", "$$biz_id"] }
                  // { $eq: ["$advertisementId", "$$advertiserId"] },
                  // { $eq: ["$businessId", "$$biz_id"] }
                  // ,
                  // { $eq: ["$type", "ad"] }
                ]
              }
            }
          }
        ],
        as: "imgs"
      }
    },
    // { $unwind: "$imgs" },

    {
      $project: {
        name: 1,
        email: 1,
        company: 1,
        category: 1,
        description: 1,
        latitude: 1,
        longitude: 1,
        "advertiser.name": 1,
        "advertiser.email": 1,
        "advertisements._id": 1,
        "advertisements.businessId": 1,
        "advertisements.name": 1,
        "advertisements.description": 1,
        "advertisements.discount": 1,
        "advertisements.startdate": 1,
        "advertisements.enddate": 1,
        "imgs.advertiserId": 1,
        "imgs.businessId": 1,
        "imgs.advertisementId": 1,
        "imgs.imageFilename": 1,
        "imgs.imageBuffer": 1,
        "imgs.type": 1

        // "vizers.name": 1,
        // "vizers.email": 1
      }
    }
  ]).then(ads => {
    res.json(ads);
  });
});

/*

results searhing on category = seafood
[
    {
        "_id": "5beb63b1a6db2d121f0ffbfd",
        "name": "steamboat fish company",
        "email": "fish@e.com",
        "description": "fish fish fish part of c@e.com",
        "category": "seafood",
        "longitude": -106.83218547983171,
        "latitude": 40.48630560247532,
        "advertiser": [
            {
                "name": "cabo enterprises",
                "email": "c@e.com"
            }
        ],
        "advertisements": {
            "_id": "5bf092ffe0be101055274b5c",
            "businessId": "5beb63b1a6db2d121f0ffbfd",
            "name": "daily skiing special",
            "description": "we have great fish tacos",
            "discount": "20 percent off when you order 5",
            "enddate": "2018-11-30",
            "startdate": "2018-11-23"
        },
        "imgs": [
            {
                "advertiserId": "5beb634da6db2d121f0ffbfb",
                "businessId": "5beb63b1a6db2d121f0ffbfd",
                "type": "logo",
                "imageFilename": "IMG_1611.JPG"
            },
            {
                "advertiserId": "5beb634da6db2d121f0ffbfb",
                "businessId": "5beb63b1a6db2d121f0ffbfd",
                "type": "photo",
                "imageFilename": "IMG_1611.JPG"
            },
            {
                "advertiserId": "5beb634da6db2d121f0ffbfb",
                "businessId": "5beb63b1a6db2d121f0ffbfd",
                "advertisementId": "5bf3785e6ed44f0891bc7185",
                "type": "ad",
                "imageFilename": "showcase.jpg"
            },
            {
                "advertiserId": "5beb634da6db2d121f0ffbfb",
                "businessId": "5beb63b1a6db2d121f0ffbfd",
                "advertisementId": "5bf092ffe0be101055274b5c",
                "type": "ad",
                "imageFilename": "image1.jpeg"
            }
        ]
    },
    {
        "_id": "5beb63b1a6db2d121f0ffbfd",
        "name": "steamboat fish company",
        "email": "fish@e.com",
        "description": "fish fish fish part of c@e.com",
        "category": "seafood",
        "longitude": -106.83218547983171,
        "latitude": 40.48630560247532,
        "advertiser": [
            {
                "name": "cabo enterprises",
                "email": "c@e.com"
            }
        ],
        "advertisements": {
            "_id": "5bf3785e6ed44f0891bc7185",
            "businessId": "5beb63b1a6db2d121f0ffbfd",
            "name": "After hours special uu",
            "description": "for the early bird crowd",
            "discount": "buy one entree get another one free",
            "startdate": "2018-11-23",
            "enddate": ""
        },
        "imgs": [
            {
                "advertiserId": "5beb634da6db2d121f0ffbfb",
                "businessId": "5beb63b1a6db2d121f0ffbfd",
                "type": "logo",
                "imageFilename": "IMG_1611.JPG"
            },
            {
                "advertiserId": "5beb634da6db2d121f0ffbfb",
                "businessId": "5beb63b1a6db2d121f0ffbfd",
                "type": "photo",
                "imageFilename": "IMG_1611.JPG"
            },
            {
                "advertiserId": "5beb634da6db2d121f0ffbfb",
                "businessId": "5beb63b1a6db2d121f0ffbfd",
                "advertisementId": "5bf3785e6ed44f0891bc7185",
                "type": "ad",
                "imageFilename": "showcase.jpg"
            },
            {
                "advertiserId": "5beb634da6db2d121f0ffbfb",
                "businessId": "5beb63b1a6db2d121f0ffbfd",
                "advertisementId": "5bf092ffe0be101055274b5c",
                "type": "ad",
                "imageFilename": "image1.jpeg"
            }
        ]
    }
]
*/

router.get("/tizerdata_api", (req, res) => {
  let id = req.params.id;
  //let query = { businessId: id };
  //console.log("advertise api bizid ", id);
  let query = {}; // businessId: ObjectId(id), type: "ad" };
  // Business.aggregate([
  //   { $match: query },

  Advertiser.aggregate([
    { $match: query },

    {
      $lookup: {
        from: "businesses",
        let: { advertiser_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$advertiserId", "$$advertiser_id"] }]
              }
            }
          }
        ],
        as: "bizes"
      }
    },
    { $unwind: "$bizes" },

    {
      $lookup: {
        from: "advertisements",
        let: { biz_id: "$bizes._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$businessId", "$$biz_id"] }]
              }
            }
          }
        ],
        as: "advertisements"
      }
    },
    { $unwind: "$advertisements" },

    // this will join against advertisements and just show the ad image
    // {
    //   $lookup: {
    //     from: "images",
    //     let: { ad_id: "$advertisements._id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               { $eq: ["$advertisementId", "$$ad_id"] },
    //               { $eq: ["$type", "ad"] }
    //             ]
    //           }
    //         }
    //       }
    //     ],
    //     as: "imgs"
    //   }
    // },
    // { $unwind: "$imgs" },

    // this will show all images for a business, logo,photos and ads.  no need to unwind
    {
      $lookup: {
        from: "images",
        let: { biz_id: "$bizes._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$businessId", "$$biz_id"] }
                  // ,
                  // { $eq: ["$type", "ad"] }
                ]
              }
            }
          }
        ],
        as: "imgs"
      }
    },
    // { $unwind: "$imgs" },

    {
      $project: {
        name: 1,
        email: 1,
        company: 1,
        "bizes._id": 1,
        "bizes.advertiserId": 1,
        "bizes.name": 1,
        "bizes.description": 1,
        "bizes.latitude": 1,
        "bizes.longitude": 1,

        "advertisements._id": 1,
        "advertisements.businessId": 1,
        "advertisements.name": 1,
        "advertisements.description": 1,
        "advertisements.discount": 1,
        "advertisements.startdate": 1,
        "advertisements.enddate": 1,
        "imgs.advertiserId": 1,
        "imgs.businessId": 1,
        "imgs.advertisementId": 1,
        "imgs.imageFilename": 1,
        "imgs.type": 1

        // "vizers.name": 1,
        // "vizers.email": 1
      }
    }
  ]).then(ads => {
    res.json(ads);
  });
});

router.get("/imagedata_api", (req, res) => {
  let id = req.params.id;
  //let query = { businessId: id };
  console.log("advertise api bizid ", id);
  let query = {}; // businessId: ObjectId(id), type: "ad" };
  Image.aggregate([
    { $match: query },

    {
      $lookup: {
        from: "advertisements",
        localField: "advertisementId",
        foreignField: "_id",
        as: "adverts"
      }
    },
    { $unwind: "$adverts" },

    {
      $lookup: {
        from: "businesses",
        localField: "businessId",
        foreignField: "_id",
        as: "bizes"
      }
    },
    { $unwind: "$bizes" },
    {
      $lookup: {
        from: "advertisers",
        localField: "advertiserId",
        foreignField: "_id",
        as: "vizers"
      }
    },
    { $unwind: "$vizers" },

    {
      $project: {
        imageFilename: 1,
        type: 1,
        "adverts.name": 1,
        "bizes.name": 1,
        "bizes.description": 1,
        "bizes.latitude": 1,
        "bizes.longitude": 1,
        "vizers.name": 1,
        "vizers.email": 1
      }
    }
  ]).then(ads => {
    res.json(ads);
  });
});

router.get("/doadimagejoin/:id", (req, res) => {
  let id = req.params.id;
  //let query = { businessId: id };
  console.log("advertise api bizid ", id);
  let query = { businessId: ObjectId(id), type: "ad" };
  Image.aggregate([
    { $match: query },

    {
      $lookup: {
        from: "advertisements",
        localField: "advertisementId",
        foreignField: "_id",
        as: "adverts"
      }
    },
    { $unwind: "$adverts" },

    {
      $lookup: {
        from: "businesses",
        localField: "businessId",
        foreignField: "_id",
        as: "bizes"
      }
    },
    { $unwind: "$bizes" },
    {
      $lookup: {
        from: "advertisers",
        localField: "advertiserId",
        foreignField: "_id",
        as: "vizers"
      }
    },
    { $unwind: "$vizers" },

    {
      $project: {
        imageFilename: 1,
        type: 1,
        "adverts.name": 1,
        "bizes.name": 1,
        "bizes.description": 1,
        "vizers.name": 1,
        "vizers.email": 1
      }
    }
  ]).then(ads => {
    res.json(ads);
  });
});

router.get("/bummer_doadimagejoin/:id", (req, res) => {
  let id = req.params.id;
  // let query = { businessId: id };
  console.log("advertise api bizid ", id);
  //let query = { businessId: ObjectId(id), type: "ad" };
  let query = { _id: ObjectId(id) };
  Business.aggregate([
    { $match: query },

    {
      $lookup: {
        from: "advertisements",
        // localField: "_id",
        // foreignField: "businessId",
        pipeline: [{ $match: { businessId: ObjectId(id) } }],
        as: "adverts"
      }
    },
    { $unwind: "$adverts" },

    // {
    //   $lookup: {
    //     from: "advertisers",
    //     localField: "advertiserId",
    //     foreignField: "_id",
    //     as: "vizers"
    //   }
    // },
    // { $unwind: "$vizers" },

    {
      $lookup: {
        from: "images",

        localField: "businessId",
        foreignField: "businessId",
        // pipeline: [
        //   {
        //     $match: {
        //       type: "ad",
        //       businessId: ObjectId(id),
        //       advertisementId: ObjectId("$adverts._id")
        //     }
        //   }
        // ],
        as: "images"
      }
    },
    { $unwind: "$images" },
    // { $match: { images: { "images.type": "ad" } } },

    {
      $project: {
        name: 1,
        "adverts._id": 1,
        "adverts.name": 1,
        "adverts.businessId": 1,
        "bizes.name": 1,
        "vizers.name": 1,
        "vizers.email": 1,
        "images.imageFilename": 1,
        "images.type": 1
      }
    }
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
