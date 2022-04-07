const express = require("express");
const multer = require("multer");
const tesseract = require("node-tesseract-ocr");
const ejs = require("ejs");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.render("index", { result: " " });
});

app.post("/", upload.single("file"), (req, res) => {
  const fileName = "./uploads/" + req.file.originalname;
  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  };

  tesseract
    .recognize(fileName, config)
    .then((text) => {
      res.render("index", { result: text });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
