const express = require("express");
const router = express.Router();

// const Shuttle = require("../../models/Shuttle");
// const Trip = require("../../models/Trip");
const Advertiser = require("../../models/Advertiser");
const Advertisement = require("../../models/Advertisement");

// methodds to support shuttles
router.get("/test", (req, res) => res.json({ msg: "shuttle works" }));

// router.post("/newshuttle", (req, res) => {
//   // const { errors, isValid } = validateRegisterInput(req.body);

//   // // Check Validation
//   // if (!isValid) {
//   //   return res.status(400).json(errors);
//   // }

//   //User.findOne({ email: req.body.email }).then(user => {
//   // if (user) {
//   //   errors.email = "Email already exists";
//   //   return res.status(400).json(errors);
//   // } else {
//   //   const avatar = gravatar.url(req.body.email, {
//   //     s: "200", // Size
//   //     r: "pg", // Rating
//   //     d: "mm" // Default
//   //   });
//   const newShuttle = new Shuttle({
//     name: req.body.name,
//     model: req.body.model,
//     size: req.body.size
//   });

//   newShuttle
//     .save()
//     .then(shuttle => res.json(shuttle))
//     .catch(err => console.log(err));
// });

router.get("/advertisers", (req, res) => {
  Advertiser.find()
    .then(advertisers => res.json(advertisers))
    .catch(err => res.status(404).json({ nousersfound: "No shuttle found" }));
});

router.get("/advertisements", (req, res) => {
  Advertisement.find()
    .then(advertisements => res.json(advertisements))
    .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
});

router.post("/createAdvertisement", (req, res) => {
  const newAd = new Advertisement({
    name: req.body.name,
    email: req.body.email,
    description: req.body.description,
    image: req.body.image,
    telephone: req.body.telephone,
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
