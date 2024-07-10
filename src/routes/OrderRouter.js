const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { authUserMiddleware, authMiddleware } = require('../middleware/authMiddleware')



router.post('/create', OrderController.CreateOrder)
router.get('/user/:userId', OrderController.GetOrdersByUserId);
router.get('/getAllOrder', OrderController.getAllOrder);
router.put('/update/:userId/:orderId', OrderController.updateOrder)
router.delete('/delete/:userId/:orderId', authMiddleware, OrderController.deleteOrder)


module.exports = router