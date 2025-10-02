const {
  register,
  verifyCode,
  login,
  resendCode,
  checkAuth,
  forgetPassword,
  resetPassword,
  changePassword,
  update,
  deleteUser,
} = require("../controller/user");

const uploads = require("../middleware/multer");
const { checkLogin } = require("../middleware/auth");
const { resendValidator, verifyValidator, registerValidator } = require("../middleware/validator");

const router = require("express").Router();
router.post("/register", uploads.single("profilePicture"), registerValidator, register);
router.put("/update/:id", uploads.single("profilePicture"), update);
router.delete("/delete/:id", uploads.single("profilePicture"), deleteUser);

router.post("/login", login);
router.post("/send-code", resendValidator, resendCode);
router.post("/verify-code", verifyValidator, verifyCode);
router.get("/", checkAuth);

router.post("/password", forgetPassword);
router.post("/reset/:id", resetPassword);
router.put("/password", checkLogin, changePassword);

module.exports = router;
