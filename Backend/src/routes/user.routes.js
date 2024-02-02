const express = require('express')
const { UserController } = require('../controllers')
const {Auth, AuthAdmin} = require('../middlewares/Auth')
const router = express.Router()


router.route("/create")
.post(UserController.UserCreate)
router.route('/login')
.post(UserController.UserLogin)

router.route('/logout')
.post(Auth,UserController.UserLogout)

  router.route("/admin/Userid/:id")
  .get(Auth,AuthAdmin('admin'),UserController.UserFindByid)
  .delete(Auth,AuthAdmin('admin'),UserController.DeleteUser)
  .patch(Auth,AuthAdmin('admin'),UserController.UpdateUser)

  router.route("/resetpassword")
  .post(UserController.ForgatePassword)
  router.route('/password/reset/:token')
  .patch(UserController.ResetPassword)

  router.route('/password/updatepasword')
  .patch(Auth,UserController.UpdateUserPassword)
  router.route('/me/updaeprofile')
  .patch(Auth,UserController.UpdateUserProfile)

  router.route("/admin/userid/:id")
  .get(Auth,AuthAdmin('admin'),UserController.getUserByidandadmin)

  router.route("/admin/role")
  .patch(Auth,AuthAdmin('admin'),UserController.UpdateUserRole)
  

router.route("/admin/alluser/")
.get(Auth,AuthAdmin('admin'),UserController.FindAllUser)

module.exports = router
