const express = require("express");
const router = express.Router();

// const Shuttle = require("../../models/Shuttle");
// const Trip = require("../../models/Trip");
const Advertiser = require("../../models/Advertiser");
const Business = require("../../models/Business");

const validateAdvertisementInput = require("../../validation/advertisement");

router.get("/advertisers", (req, res) => {
  // console.log("getting advertisers");
  Advertiser.find()
    .sort({ _id: 1 })
    .then(advertisers => res.json(advertisers))
    .catch(err => res.status(404).json({ nousersfound: "No shuttle found" }));
});

router.get("/businesses", (req, res) => {
  //Business.find({ sort: { ownerid: 1 } })
  Business.find()
    .sort({ ownerid: 1 })
    .then(data => {
      // console.log("all advertisements", advertisements);
      res.json(data);
    })
    .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
});

router.get("/advertisements_api", (req, res) => {
  Advertiser.find()
    .then(advertisements => res.json(advertisements))
    .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
});

router.get("/businesses/:id", (req, res) => {
  let id = req.params.id;
  //console.log("getting advertisements for id", id);
  let query = { ownerid: id };
  Business.find(query)
    .then(data => {
      // dispatch({ type: SET_CURRENT_ADVERTISEMENTs, payload: advertisements });
      res.json(data);
    })
    .catch(err => res.status(404).json({ nousersfound: "No shuttle found" }));
});

router.post("/createBusiness", (req, res) => {
  const { errors, isValid } = validateAdvertisementInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newAd = new Business({
    name: req.body.name,
    email: req.body.email,
    description: req.body.description,
    image: req.body.image,
    photo: req.body.photo,
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

  newAd
    .save()
    .then(newAd => res.json(newAd))
    .catch(err => console.log(err));
});

router.post("/modifyBusiness", (req, res) => {
  const { errors, isValid } = validateAdvertisementInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let id = req.body.id;
  let query = { _id: id };

  var options = { new: true };

  //Advertisement.find(query)

  const updateobj = {
    name: req.body.name,
    email: req.body.email,
    description: req.body.description,
    image: req.body.image,
    photo: req.body.photo,
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
  };

  Business.findOneAndUpdate(query, updateobj, options)
    .then(newAd => res.json(newAd))
    .catch(err => console.log(err));
});

router.get("/delete-business/:id", (req, res) => {
  //console.log("in advertise get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  Business.deleteOne(query)
    .then(advertisement => res.json(advertisement))
    .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
});

router.get("/delete-advertiser/:id", (req, res) => {
  console.log("in advertise get delete-advertiser", req.params);
  let id = req.params.id;
  let query = { _id: id };
  Advertiser.deleteOne(query)
    .then(rid => res.json(query))
    .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
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
      res.status(404).json({ nousersfound: "no advertiser found" })
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
      res.status(404).json({ nousersfound: "no advertiser found" })
    );
});

// end play area

router.get("/find-business/:id", (req, res) => {
  //console.log("in advertisers get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  Business.find(query)
    .then(advertisement => res.json(advertisement))
    .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
});

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
