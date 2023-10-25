export const verifyCartAccess = (req, res, next) => {
  if (req.user.cart === req.params.cid) {
    next();
  } else {
    res.send({ status: "failure", details: "You can only use your cart" });
  }
};
