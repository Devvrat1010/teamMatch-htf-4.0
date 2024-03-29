require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const client = require("./mongodb");
const bodyParser = require("body-parser");

mongoose.set("strictQuery", false);

const dbURI = process.env.DB_URI;
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// const allUsers = require("./route/userOperation/getUsers");
// const addFriend = require("./route/userOperation/addFriend");
// const addSkills = require("./route/userOperation/addSkills");
// const updateUser = require("./route/userOperation/updateUser");
// const removeFriend = require("./route/userOperation/removeFriend");
// const getUserById = require("./route/userOperation/getUserById");
// const getLoggedInUser = require("./route/userOperation/getLoggedInUser");

// const createHackathon = require("./route/hackathons/createHackathon");
// const getAllHackathons = require("./route/hackathons/getAllHackathons");

// const getRoomCode = require("./route/chatOperations/getRoomCode");
// const saveChats = require("./route/chatOperations/saveChats");
// const getChats = require("./route/chatOperations/getChats");
// const updateHackathon = require("./route/hackathons/updateHackathon");

const auth = require("./route/auth");
const userCRUD = require("./route/userCRUD");
const hackathonsCRUD = require("./route/hackathonsCRUD");
const chatCRUD = require("./route/chatCRUD");

// app.use("/allUsers", allUsers);
// app.use("/addFriend", addFriend);
// app.use("/addSkills", addSkills);
// app.use("/updateUser", updateUser);
// app.use("/removeFriend", removeFriend);
// app.use("/getUserById", getUserById);
// app.use("/getLoggedInUser", getLoggedInUser);
// app.use("/createHackathon", createHackathon);
// app.use("/getAllHackathons", getAllHackathons);
// app.use("/getRoomCode", getRoomCode);
// app.use("/saveChats", saveChats);
// app.use("/getChats", getChats);
// app.use("/updateHackathon", updateHackathon);

app.use("/auth", auth);
app.use("/userCRUD", userCRUD);
app.use("/hackathonsCRUD", hackathonsCRUD);
app.use("/chatCRUD", chatCRUD);

const start = async () => {
  try {
    await mongoose.connect(dbURI);
    app.listen(5000, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server side error" });
  }
};

app.use("/", (req, res) => {
  res.send("Hello World");
});

start();
