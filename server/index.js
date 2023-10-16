const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
const RegisterModel = require("./model/Register");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

mongoose.connect("mongodb://127.0.0.1:27017/test");

pdfMake.vfs = pdfFonts.pdfMake.vfs

app.post("/register", async (req, res) => {
  const formData = req.body;

  try {
    const existingUser = await RegisterModel.findOne({ email: formData.email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered with this email" });
    }

      formData.registrationDate = new Date()
      try {
        const newUser = await RegisterModel.create({
          firstname: formData.firstname,
          lastname: formData.lastname,
          profilePicture: formData.profilePicture,
          dob: formData.dob,
          gender: formData.gender,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          nationality: formData.nationality,
          countryOfResidence: formData.countryOfResidence,
          state: formData.state,
          registrationDate: formData.registrationDate
        });

        res.json({ message: "User registered", newUser });
      } catch (err) {
        console.error("User registration error:", err);
        return res.status(500).json({ error: "User registration failed" });
      }

  } catch (error) {
    console.error("User registration error:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
});


app.get("/users", async (req, res) => {
  try {
    const users = await RegisterModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
