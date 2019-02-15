const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Advertiser = require("../../models/Advertiser");
const Business = require("../../models/Business");
const Advertisement = require("../../models/Advertisement");
const Image = require("../../models/Image");

router.get("/dispatch-ads-everything_api", (req, res) => {
  //  console.log(req.params);
  //let id = req.params.id;
  let type = req.query.type;
  let value = req.query.value;

  console.log("type", type);
  console.log("value", value);
  //let query = { businessId: id };
  //console.log("advertise api bizid ", id);
  let query = { category: "Food" }; // businessId: ObjectId(id), type: "ad" };
  let qry = {};
  if (type !== undefined && value !== undefined) {
    qry[type] = value;
  }

  console.log(qry);

  Business.aggregate([
    { $match: qry },

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

    {
      $lookup: {
        from: "images",
        let: { biz_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$businessId", "$$biz_id"] },
                  { $eq: ["$type", "logo"] }
                ]
              }
            }
          }
        ],
        as: "bizimgs"
      }
    },

    {
      $lookup: {
        from: "images",
        let: { biz_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$businessId", "$$biz_id"] },
                  { $eq: ["$type", "photo"] }
                ]
              }
            }
          }
        ],
        as: "bizphotoimgs"
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
    // we have to unwind this to use the id below so we dont
    //{ $unwind: "$advertisements" },

    {
      $lookup: {
        from: "images",
        //let: { ad_id: "$advertisements._id" },
        let: { biz_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$businessId", "$$biz_id"] },
                  { $eq: ["$type", "ad"] }
                ]
              }
            }
          }
        ],
        as: "imgs"
      }
    },
    //{ $unwind: "$imgs" },

    {
      $project: {
        name: 1,
        email: 1,
        company: 1,
        category: 1,
        description: 1,
        latitude: 1,
        longitude: 1,
        address: 1,
        city: 1,
        state: 1,
        phone: 1,

        "advertiser.name": 1,
        "advertiser.email": 1,
        "bizimgs.imageFilename": 1,
        "bizimgs.type": 1,
        "bizimgs.advertisementId": 1,
        "bizimgs.imageBuffer": 1,
        "bizimgs.width": 1,
        "bizimgs.height": 1,
        "bizphotoimgs.imageFilename": 1,
        "bizphotoimgs.type": 1,
        "bizphotoimgs.imageBuffer": 1,
        "bizphotoimgs.width": 1,
        "bizphotoimgs.height": 1,
        "advertisements._id": 1,
        "advertisements.businessId": 1,
        "advertisements.name": 1,
        "advertisements.description": 1,
        "advertisements.discount": 1,
        "advertisements.startdate": 1,
        "advertisements.enddate": 1,
        "imgs.businessId": 1,
        "imgs.advertisementId": 1,
        "imgs.imageFilename": 1,
        "imgs.imageBuffer": 1,
        "imgs.type": 1,
        "imgs.width": 1,
        "imgs.height": 1
      }
    }
  ]).then(ads => {
    res.json(ads);
  });
});

router.get("/dispatch-ads-business_api", (req, res) => {
  //  console.log(req.params);
  //let id = req.params.id;
  let type = req.query.type;
  let value = req.query.value;

  //console.log("type", type);
  //console.log("value", value);
  //let query = { businessId: id };
  //console.log("advertise api bizid ", id);
  let query = { category: "Food" }; // businessId: ObjectId(id), type: "ad" };
  let qry = {};
  if (type !== undefined && value !== undefined) {
    qry[type] = value;
  }

  //console.log(qry);

  Business.aggregate([
    { $match: qry },
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

    // {
    //   $lookup: {
    //     from: "images",
    //     let: { biz_id: "$_id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               { $eq: ["$businessId", "$$biz_id"] },
    //               { $eq: ["$type", "logo"] }
    //             ]
    //           }
    //         }
    //       }
    //     ],
    //     as: "bizimgs"
    //   }
    // },

    // Advertiser.aggregate([
    //   { $match: query },

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
    // we have to unwind this to use the id below so we dont
    //{ $unwind: "$advertisements" },

    {
      $project: {
        name: 1,
        email: 1,
        company: 1,
        category: 1,
        description: 1,
        latitude: 1,
        longitude: 1,
        address: 1,
        city: 1,
        state: 1,
        phone: 1,
        "advertiser.name": 1,
        "advertiser.email": 1,
        // "bizimgs.imageFilename": 1,
        // "bizimgs.type": 1,
        // "bizimgs.advertisementId": 1,
        // // "bizimgs.imageBuffer": 1,
        // "bizimgs.width": 1,
        // "bizimgs.height": 1,

        "advertisements._id": 1,
        "advertisements.businessId": 1,
        "advertisements.name": 1,
        "advertisements.description": 1,
        "advertisements.discount": 1,
        "advertisements.startdate": 1,
        "advertisements.enddate": 1
      }
    }
  ]).then(ads => {
    res.json(ads);
  });
});

router.get("/businesses_api", (req, res) => {
  //  console.log(req.params);
  //let id = req.params.id;
  let type = req.query.type;
  let value = req.query.value;

  //console.log("type", type);
  //console.log("value", value);
  //let query = { businessId: id };
  //console.log("advertise api bizid ", id);
  let query = { category: "Food" }; // businessId: ObjectId(id), type: "ad" };
  let qry = {};
  if (type !== undefined && value !== undefined) {
    qry[type] = value;
  }

  Business.find(qry)
    .then(advertisement => {
      return res.json(advertisement);
    })
    .catch(err =>
      res.status(404).json({ message: "cannot change business status" })
    );
});

router.get("/advertisers_api", (req, res) => {
  //  console.log(req.params);
  //let id = req.params.id;
  // let type = req.query.type;
  // let value = req.query.value;

  //console.log("type", type);
  //console.log("value", value);
  //let query = { businessId: id };
  //console.log("advertise api bizid ", id);
  let query = { category: "Food" }; // businessId: ObjectId(id), type: "ad" };
  let qry = {};
  // if (type !== undefined && value !== undefined) {
  //   qry[type] = value;
  // }

  Advertiser.find(qry)
    .then(advertisement => {
      return res.json(advertisement);
    })
    .catch(err =>
      res.status(404).json({ message: "cannot change business status" })
    );
});

router.get("/advertisements_api", (req, res) => {
  let query = { category: "Food" }; // businessId: ObjectId(id), type: "ad" };
  let qry = {};
  // if (type !== undefined && value !== undefined) {
  //   qry[type] = value;
  // }

  Advertisement.find(qry)
    .then(advertisement => {
      return res.json(advertisement);
    })
    .catch(err =>
      res.status(404).json({ message: "cannot change business status" })
    );
});

module.exports = router;
