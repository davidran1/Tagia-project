const { createOrder, captureOrder } = require("../Services/paypalService");
const catchAsync = require("../utils/catchAsync");

//getting the cart details from the body and creating the order using paypal service.
exports.createOrderController = catchAsync(async (req, res, next) => {
  const { cart } = req.body;
  const { jsonResponse, httpStatusCode } = await createOrder(cart);
  res.status(httpStatusCode).json(jsonResponse);
});

//Getting the orderID from the body and capturing the order using paypal service.
exports.captureOrderController = catchAsync(async (req, res, next) => {
  const { orderID } = req.params;
  const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
  res.status(httpStatusCode).json(jsonResponse);
});
