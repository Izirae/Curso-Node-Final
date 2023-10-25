export const generateProductCodeErrorInfo = (product) => {
  return `A product with the code ${product.code} already exists`;
};

export const generateProductIdErrorInfo = (productId) => {
  return `There is no product with id ${productId}`;
};

export const generateMissingProductsParamsErrorInfo = (product) => {
  return `One or more properties were incomplete or invalid
  List of required properties:
  *title: ${product.title},
  *description: ${product.description}
  *price: ${product.price},
  *code: ${product.code},
  *stock: ${product.stock},
  *category: ${product.category},
  *status: ${product.status}`;
};
