const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const RegisterModel = require("./model/Register");

const app = express();
app.use(cors());
app.use(express.json());


app.use(fileUpload());

mongoose.connect("mongodb://127.0.0.1:27017/test");

app.post("/register", (req, res) => {
    const formData = req.body;
  


  RegisterModel.findOne({ email: formData.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ error: "User already registered with this email" });
      } else {
        const profilePicture = req.files.profilePicture;

        RegisterModel.create({
          firstname: formData.firstname,
          lastname: formData.lastname,
          profilePicture: {
            data: profilePicture.data, 
            contentType: profilePicture.mimetype,
          },
          dob: formData.dob,
          gender: formData.gender,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          nationality: formData.nationality,
          countryOfResidence: formData.countryOfResidence,
          state: formData.state,
        })
          .then(() => res.json({ message: "User registered" }))
          .catch((err) => res.status(500).json({ error: err.message }));
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
