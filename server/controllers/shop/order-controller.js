const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const createOrder = async (req, res) => {
  try {
    const {
      fullName,
      email,
      age,
      phone,
      address,
      region,
      notes,
      cartItems,
      totalAmount,
      orderDate,
    } = req.body;
    console.log(req.body);

    const newlyCreatedOrder = new Order({
      fullName,
      email,
      age,
      phone,
      address,
      region,
      notes,
      cartItems,
      totalAmount,
      orderDate,
    });

    console.log(newlyCreatedOrder);

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
};
