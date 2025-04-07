// authRoute.js
const express = require("express");
const verifyToken = require("../middleware/verifyToken"); // подключаем миддлевэр для проверки токена

const router = express.Router();

// Проверка авторизации
router.get("/", verifyToken, (req, res) => {
  console.log("Check auth");
  res.status(200).send({ message: "User is authenticated" });
});

module.exports = router;
