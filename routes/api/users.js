const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const Jimp = require("jimp");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const Advertiser = require("../../models/Advertiser");
const Image = require("../../models/Image");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

//**************************
// CREATE
//**************************

router.post("/register", (req, res) => {
  //console.log("in user api about to register");
  const { errors, isValid } = validateRegisterInput(req.body, true);
  //console.log("request body", req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  if (!req.files) {
    let errors = {};
    errors.noimage = "Please select an image file";
    return res.status(400).json(errors);
  }
  let imageFile = req.files.file;
  let fname = imageFile.name;

  Advertiser.findOne({ email: req.body.email }).then(advertiser => {
    if (advertiser) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newAdvertiser = new Advertiser({
        name: req.body.name,
        email: req.body.email,
        company: req.body.company,
        password: req.body.password,
        role: req.body.role,
        status: req.body.status
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdvertiser.password, salt, (err, hash) => {
          if (err) throw err;
          newAdvertiser.password = hash;
          newAdvertiser.save().then(user => {
            Jimp.read(imageFile.data).then(lenna => {
              lenna
                .resize(200, Jimp.AUTO) // resize
                .quality(80); // set JPEG quality

              lenna
                .getBufferAsync(Jimp.MIME_JPEG)
                .then(imagebuf => {
                  const newImage = new Image({
                    advertiserId: user._id,
                    owneremail: user.email,
                    type: "logo",
                    category: "",
                    imageBuffer: imagebuf,
                    imageFilename: fname,
                    width: lenna.bitmap.width,
                    height: lenna.bitmap.height,
                    child: 0
                  });
                  newImage
                    .save()
                    .then(newi => {
                      let rary = [];
                      rary.push(user);
                      rary.push(newi);
                      res.json(rary);
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            });
          });
        });
      });
    }
  });
});
// router.post("/register", (req, res) => {
//   //console.log("in user api about to register");
//   const { errors, isValid } = validateRegisterInput(req.body, true);
//   //console.log("request body", req.body);
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
//   if (!req.files) {
//     let errors = {};
//     errors.noimage = "Please select an image file";
//     return res.status(400).json(errors);
//   }
//   let imageFile = req.files.file;
//   let fname = imageFile.name;

//   Advertiser.findOne({ email: req.body.email }).then(advertiser => {
//     if (advertiser) {
//       errors.email = "Email already exists";
//       return res.status(400).json(errors);
//     } else {
//       Jimp.read(imageFile.data).then(lenna => {
//         lenna
//           .resize(200, Jimp.AUTO) // resize
//           .quality(80); // set JPEG quality

//         lenna.getBufferAsync(Jimp.MIME_JPEG).then(imagebuf => {
//           const newAdvertiser = new Advertiser({
//             name: req.body.name,
//             email: req.body.email,
//             company: req.body.company,
//             password: req.body.password,
//             role: req.body.role,
//             status: req.body.status
//             // imageBuffer: imagebuf,
//             // imageFilename: fname,
//             // width: lenna.bitmap.width,
//             // height: lenna.bitmap.height
//           });
//           bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(newAdvertiser.password, salt, (err, hash) => {
//               if (err) throw err;
//               newAdvertiser.password = hash;
//               newAdvertiser
//                 .save()
//                 .then(user => {
//                   const newImage = new Image({
//                     ownerid: user._id,
//                     owneremail: user.email,
//                     type: "logo",
//                     category: "",
//                     imageBuffer: imagebuf,
//                     imageFilename: fname,
//                     width: lenna.bitmap.width,
//                     height: lenna.bitmap.height
//                   });
//                   newImage
//                     .save()
//                     .then(newi => {
//                       res.json(user);
//                     })
//                     .catch(err => console.log(err));
//                   // res.json(user);
//                 })
//                 .catch(err => console.log(err));
//             });
//           });
//         });
//       });
//     }
//   });
// });

//**************************
// MODIFY
//**************************

router.post("/modify", (req, res) => {
  let checkpw = false;
  let changepassword = false;

  let formchange = req.body.changePasswordRequest;

  if (formchange === "Yes") {
    checkpw = true;
    changepassword = true;
  }

  let uploadimage = false;
  let imageFile = null;
  let filename = "now is the time";

  if (req.files) {
    uploadimage = true;
    imageFile = req.files.file;
    filename = imageFile.name;
  }

  // console.log("uploadimage", uploadimage);
  // console.log("filename", filename);

  const { errors, isValid } = validateRegisterInput(req.body, checkpw);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let id = req.body.id;
  let query = { _id: id };
  // console.log("query", query);
  const updateobj = {
    name: req.body.name,
    email: req.body.email,
    company: req.body.company
    //companyId: req.body.companyId
  };
  var options = { new: true };

  if (uploadimage && changepassword) {
    let errors = {};
    errors.generic =
      "You cannot update your password and update your image at the same time";
    return res.status(400).json(errors);
  } else if (uploadimage) {
    query = { advertiserId: id, type: "logo" };
    console.log("update image ", query);
    Jimp.read(imageFile.data).then(lenna => {
      lenna
        .resize(200, Jimp.AUTO) // resize
        .quality(80);
      lenna
        .getBufferAsync(Jimp.MIME_JPEG)
        .then(buf => {
          updateobj.imageBuffer = buf;
          updateobj.imageFilename = filename;
          updateobj.width = lenna.bitmap.width;
          updateobj.height = lenna.bitmap.height;
          // Advertiser.findOneAndUpdate(query, updateobj, options)
          Image.findOneAndUpdate(query, updateobj, options)
            .then(newAd => {
              return res.json(newAd);
            })
            .catch(err => {
              return res.status(400).json(err);
            });
        })
        .catch(err => {
          return res.status(400).json(err);
        });
    });
  } else if (changepassword) {
    // this block works

    // if (changepassword) {
    let tpw = req.body.password;
    let hpw = "";
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(tpw, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        hpw = hash;
        updateobj.password = hpw;
        Advertiser.findOneAndUpdate(query, updateobj, options)
          .then(newAd => {
            res.json(newAd);
          })
          .catch(err => console.log(err));
      });
    }); // end of salt
  } else {
    Advertiser.findOneAndUpdate(query, updateobj, options)
      .then(newAd => {
        res.json(newAd);
      })
      .catch(err => console.log(err));
  }
  // end this block works
}); // end of post modify

//**************************
// CHANGE STATUS
//**************************

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

//**************************
// FIND USER AND IMAGE
//**************************

router.get("/find-user/:id", (req, res) => {
  let id = req.params.id;
  let query = { _id: id };
  let query2 = { advertiserId: id, type: "logo" };
  // console.log("find advertiser query", query);
  Advertiser.findOne(query)
    .then(advertiser => {
      // console.log("here is the found advertiser", advertiser);
      Image.findOne(query2)
        .then(img => {
          let rary = [];
          rary.push(advertiser);
          rary.push(img);
          res.json(rary);
        })
        .catch(err => res.status(404).json({ msg: "no1 ads found" }));
      // .catch(err => res.json({ msg: "no1 ads found" }));
    })
    .catch(err => res.status(404).json({ msg: "no2 ads found" }));
  // .catch(err => res.json({ msg: "no ads2 found" }));
});

// @route   GET api/users/login
// @desc    Login User / return jwt token
// @access  Public

//**************************
// LOGIN
//**************************
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  Advertiser.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          role: user.role,
          name: user.name,
          company: user.company,
          email: user.email,
          avatar: user.avatar,
          status: user.status
        }; // Create JWT Payload
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              role: user.role
            });
            // Bearer us a special thing for header
          }
        );
        // res.json({ msg: "Success" });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// **********************************************
// **********************************************
// here and below are not being used
// **********************************************
// **********************************************

router.get("/test", (req, res) => res.json({ msg: "users works" }));

router.get("/", (req, res) => res.json({ msg: "gets all users" }));

// @route   GET api/users/register
// @desc    Tests users route
// @access  Public

router.post("/test_register", (req, res) => {
  //console.log("in user api about to register");

  const newAdvertiser = new Advertiser({
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    password: req.body.password,
    role: req.body.role,
    status: req.body.status,
    imageBuffer: "buf",
    imageFilename: "what",
    width: 100,
    height: 200
  });

  newAdvertiser
    .save()
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

router.post("/thisoneworks_register", (req, res) => {
  //console.log("in user api about to register");
  const { errors, isValid } = validateRegisterInput(req.body, true);
  //console.log("request body", req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  if (!req.files) {
    let errors = {};
    errors.noimage = "Please select an image file";
    return res.status(400).json(errors);
  }
  let imageFile = req.files.file;

  let fname = imageFile.name;

  Advertiser.findOne({ email: req.body.email }).then(advertiser => {
    if (advertiser) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      Jimp.read(imageFile.data).then(lenna => {
        lenna
          .resize(200, Jimp.AUTO) // resize
          .quality(80); // set JPEG quality

        lenna.getBufferAsync(Jimp.MIME_JPEG).then(buf => {
          const newAdvertiser = new Advertiser({
            name: req.body.name,
            email: req.body.email,
            company: req.body.company,
            password: req.body.password,
            role: req.body.role,
            status: req.body.status,
            imageBuffer: buf,
            imageFilename: fname,
            width: lenna.bitmap.width,
            height: lenna.bitmap.height
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAdvertiser.password, salt, (err, hash) => {
              if (err) throw err;
              newAdvertiser.password = hash;
              newAdvertiser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
          });
        });
      });
    }
  });
});

// router.post("/good_register", (req, res) => {
//   const { errors, isValid } = validateRegisterInput(req.body, true);

//   if (!isValid) {
//     return res.status(400).json(errors);
//   }

//   Advertiser.findOne({ email: req.body.email }).then(advertiser => {
//     if (advertiser) {
//       errors.email = "Email already exists";
//       return res.status(400).json(errors);
//     } else {
//       const newAdvertiser = new Advertiser({
//         name: req.body.name,
//         email: req.body.email,
//         company: req.body.company,
//         companyId: req.body.companyId,
//         password: req.body.password,
//         role: req.body.role,
//         status: req.body.status
//       });

//       bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newAdvertiser.password, salt, (err, hash) => {
//           if (err) throw err;
//           newAdvertiser.password = hash;
//           newAdvertiser
//             .save()
//             .then(user => res.json(user))
//             .catch(err => console.log(err));
//         });
//       });
//     }
//   });
// });
// router.post("/formbueno_modify", (req, res) => {
//   let checkpw = false;
//   let changepassword = false;

//   let formchange = req.body.changePasswordRequest;

//   if (formchange === "Yes") {
//     checkpw = true;
//     changepassword = true;
//   }

//   console.log("req.body.changePassword", formchange);
//   console.log("changepassword", changepassword);
//   console.log("checkpw", checkpw);

//   changepassword = false;
//   checkpw = false;

//   let uploadimage = false;
//   let imageFile = null;
//   let filename = "now is the time";

//   if (req.files) {
//     uploadimage = true;
//     imageFile = req.files.file;
//     filename = imageFile.name;
//   }

//   console.log("uploadimage", uploadimage);

//   console.log("filename", filename);

//   const { errors, isValid } = validateRegisterInput(req.body, checkpw);
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
//   let id = req.body.id;
//   let query = { _id: id };
//   const updateobj = {
//     name: req.body.name,
//     email: req.body.email,
//     company: req.body.company,
//     companyId: req.body.companyId
//   };
//   var options = { new: true };

//   if (changepassword) {
//     let tpw = req.body.password;
//     let hpw = "";
//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(tpw, salt, (err, hash) => {
//         if (err) {
//           throw err;
//         }
//         hpw = hash;
//         updateobj.password = hpw;
//         Advertiser.findOneAndUpdate(query, updateobj, options)
//           .then(newAd => {
//             res.json(newAd);
//           })
//           .catch(err => console.log(err));
//       });
//     }); // end of salt
//   } else {
//     Advertiser.findOneAndUpdate(query, updateobj, options)
//       .then(newAd => {
//         res.json(newAd);
//       })
//       .catch(err => console.log(err));
//   }
// }); // end of post modify

router.get("/xxxfind-user/:id", (req, res) => {
  //console.log("in advertisers get delete-ad", req.params);
  let id = req.params.id;
  let query = { _id: id };
  Advertiser.find(query)
    .then(advertiser => res.json(advertiser))
    .catch(err => res.status(404).json({ nousersfound: "no ads found" }));
});

// 5be5d1873dc07606f782f44e
// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });

    // res.json({ msg: "Success" });
  }
);

module.exports = router;
