import { Router} from "express"
import {  emailSandValidate, userRegisterValidate, userLoginValidate } from "../validation/joiFunction.js"
import { oflineStatus, onlineStatus, userRigister, sandMail, userLogin, userLogout, getAllUsers, updateUser, searchUser, addUser, listAddUsers, addUserRemove }  from "../controller/user.controller.js"
// import { users } from "../controller/socket.controller.js"
import { verifJWT } from "../middleware/auth.middleware.js"
import { verifyOTPwithJWT } from "../middleware/verifyOTPwithJWT.middleware.js"
const router = Router();

router.route("/register").post(userRegisterValidate, userRigister)
router.route("/email").post(emailSandValidate, sandMail)
router.route("/login").post(userLoginValidate, userLogin)
router.route("/logout").post(userLogout)
router.route("/all-users").get(verifJWT, getAllUsers)
router.route("/edit").post( updateUser)
router.route("/find-user").post(verifJWT, searchUser)
router.route("/add-user").post(verifJWT, addUser)
router.route("/list-Add-Users").post(verifJWT, listAddUsers) 
router.route("/remove-Add-Users").post(verifJWT, addUserRemove)
router.route("/login-status").post(verifJWT, onlineStatus)
router.route("/logout-status").post(verifJWT, oflineStatus)



export default router