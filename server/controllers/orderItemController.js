const { OrderItem, Product } = require("../models");

const addOrderItem = async (req, res) => {
  const { productId, quantity } = req.body;
  console.log("Product ID: ", productId, "Quantity: ", quantity);
  const createdItems = await Promise.all(
    productId.map(async (element, index) => {
      const product = await Product.findByPk(element);
      product.stock -= quantity[index];
      await product.save();
      return await OrderItem.create({
        user_id: req.user,
        product_id: element,
        quantity: quantity[index],
      });
    })
  );

  console.log("Order created");
  return res
    .status(201)
    .json({ message: "Order items created", items: createdItems });
};

const getOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll({
      where: { user_id: req.user },
      include: Product,
    });
    res.json(orderItems);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

module.exports = { addOrderItem, getOrderItems };
