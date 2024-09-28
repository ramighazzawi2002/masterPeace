const { Cart, Product } = require("../models");

const getCart = async (req, res) => {
  try {
    const id = req.user;
    const cart = await Cart.findAll({
      where: { userId: id },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price"],
        },
      ],
    });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cartItem = await Cart.findByPk(id);
    cartItem.quantity = quantity;
    await cartItem.save();
    return res.status(200).json(cartItem);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId, quantity } = req.body;
    const existingCartItem = await Cart.findOne({
      where: { userId, productId },
    });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json(existingCartItem);
    }
    const cartItem = await Cart.create({ userId, productId, quantity });
    return res.status(201).json(cartItem);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user;
    await Cart.destroy({ where: { userId } });
    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getCart, updateQuantity, addToCart, clearCart };
