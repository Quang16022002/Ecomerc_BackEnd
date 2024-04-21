const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const {authMiddleware, authUserMiddleware} = require('../middleware/authMiddleware')




router.post('/singup', userController.createUser)
router.post('/singin', userController.loginUser)
router.put('/update-user/:id', userController.updateUser)
router.delete('/delete-user/:id',authMiddleware,  userController.deleteUser)
router.get('/getAll',authMiddleware,  userController.getAllUser)
router.get('/get-details/:id',authUserMiddleware, userController.getDetailsUser)
router.post('/refresh-token',  userController.refreshToken)

module.exports = router