import { faker } from "@faker-js/faker";

export const generateProductsMock = (numberOfProducts) => {
  let productsMock = [];

  for (let i = 0; i < numberOfProducts; i++) {
    let newMockProduct = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      thumbnails: [],
      code: i + 1,
      stock: faker.number.int({ min: 0, max: 999 }),
      category: faker.commerce.department(),
      status: "true",
    };

    productsMock.push(newMockProduct);
  }

  return productsMock;
};
