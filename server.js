const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users/userRoute");
const photosRoutes = require("./routes/photos/photosRoute");

const app = express();

const PORT = process.env.PORT || 5000;

//configuraions  access
dotenv.config();

// qrbw6wU7plZSjCBI

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
// app.use(cors());
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   })
// );

// d2

app.use(
  cors({
    origin: [
      "photostore-ddauerethphxcraw.southindia-01.azurewebsites.net",
      "http://localhost:5173",
      // "http://localhost:3000",
      // "https://lively-smoke-0fb411610.5.azurestaticapps.net",
      "https://polite-sand-088980c10.5.azurestaticapps.net",
    ],
    credentials: true,
  })
);

//Users route
app.use("/api/users", userRoutes);
app.use("/api/photos", photosRoutes);

// d2

app.get("/", (req, res) => {
  res.send("welcome to azure deployment shiva aade git1");
});

app.get("/welcome", (req, res) => {
  res.send("welcome to real time deployment");
});

app.get("/new", (req, res) => {
  res.json({ message: "welcome to real time deployment" });
});

// app.listen(PORT, () => {
//   console.log(`Server is running succesfully`);
// });
// const start = async () => {
//   if (!process.env.MONGODB_URL) {
//     throw new Error("auth DB_URI must be defined");
//   }
//   try {
//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Server connected to MongoDb!");
//   } catch (err) {
//     console.error(err);
//     throw new Error("auth DB_URI must be defined");
//   }

//   app.listen(PORT, () => {
//     console.log(`Server is connected to ${PORT}`);
//   });
// };

const start = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("auth DB_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Server connected to MongoDb!");
  } catch (err) {
    console.error(err);
    throw new Error("auth DB_URI must be defined");
  }

  app.listen(PORT, () => {
    console.log(`Server is connected to ${PORT}`);
  });
};

// start();

start();
