const fs = require("fs");

const loadProducts = () => {
  try {
    const data = fs.readFileSync("./db/products.json");
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

const addProduct = (userToken, product) => {
  const products = loadProducts();
  const num = products.reduce(
    (total, current) => total + current.entries.length,
    0
  );

  const prodsForUser = products.find((prod) => prod.userToken === userToken);
  let newProducts = [];
  const addedProduct = { ...product, id: num + 1 };
  if (prodsForUser) {
    newProducts = products.map((prod) => {
      if (prod.userToken === userToken) {
        return {
          userToken,
          entries: prod.entries.concat(addedProduct),
        };
      } else {
        return prod;
      }
    });
  } else {
    newProducts = products.concat({
      userToken,
      entries: [addedProduct],
    });
  }

  if (saveProducts(newProducts)) {
    return addedProduct;
  } else {
    return null;
  }
};

const updateProduct = (userToken, product) => {
  const products = loadProducts();
  const prodsForUser = products.find((prod) => prod.userToken === userToken);
  let newProducts = [];
  if (prodsForUser) {
    newProducts = products.map((prod) => {
      if (prod.userToken === userToken) {
        const entries = prod.entries.map((entry) => {
          if (entry.id === product.id) {
            return product;
          } else {
            return entry;
          }
        });
        return {
          userToken,
          entries,
        };
      } else {
        return prod;
      }
    });
  }

  if (saveProducts(newProducts)) {
    return product;
  } else {
    return null;
  }
};

const removeProduct = (userToken, entryId) => {
  const products = loadProducts();
  const prodsForUser = products.find((prod) => prod.userToken === userToken);
  let newProducts = [];
  if (prodsForUser) {
    newProducts = products.map((prod) => {
      if (prod.userToken === userToken) {
        const entries = prod.entries.filter((entry) => entry.id !== entryId);
        return {
          userToken,
          entries,
        };
      } else {
        return prod;
      }
    });
  }

  return saveProducts(newProducts);
};

const saveProducts = (products) => {
  try {
    fs.writeFileSync("./db/products.json", JSON.stringify(products));
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  loadProducts,
  saveProducts,
  addProduct,
  updateProduct,
  removeProduct,
};
