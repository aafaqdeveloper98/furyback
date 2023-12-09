const express = require("express")
const router = express.Router()
const {protect, isAdmin} = require("../middleWare/authMiddleware")
const { 
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    getAdmin,
} = require("../controllers/userController")


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/loggedin", protect, loginStatus);

// isAdmin
router.get("/admin", protect, isAdmin, getAdmin);

router.patch("/updateuser", protect, updateUser);
router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);



module.exports = router