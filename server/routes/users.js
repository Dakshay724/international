const router = require("express").Router();
const {
  createUser,
  verifyOTP,
  userLogin,
  getUserDataByIdInPdf,
  getUserDataByIdInXLSX,
} = require("../controllers/users");
const multer = require("multer");
const auth = require("../middlewares/auth");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "upload/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});
router.post("/upload", upload.single("image"), (req, res) => {
  res.json();
});

router.post("/createUser", upload.single("image"), createUser);
router.patch("/verifyOTP", verifyOTP);
router.post("/userLogin", userLogin);
router.get("/getUserDataByIdInPdf", auth, getUserDataByIdInPdf);
router.get("/getUserDataByIdInXLSX", auth, getUserDataByIdInXLSX);

module.exports = router;
