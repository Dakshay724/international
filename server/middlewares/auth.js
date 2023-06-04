const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/users");

const auth = async (req, res, next) => {
  const token = req.header("Authorization");
  try {
    if (!token)
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Provide token",
        data: [],
      });
    const verified = jwt.verify(token, process.env.JWTSECRETKEY);
    req["data"] = verified;
    const id = req["data"].id;

    if (id) {
      const user = await User.findById(id);
      if (user) {
        req["data"] = user;
        next();
      } else {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Unauthorized user",
          data: [],
        });
      }
    } else {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized user",
        data: [],
      });
    }
  } catch (error) {
    return res.send({
      success: false,
      message: "Something went wrong",
      data: [],
      error: error.message,
    });
  }
};

module.exports = auth;
