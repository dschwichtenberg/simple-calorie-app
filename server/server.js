const express = require("express");
const cors = require("cors");

// user controllers
const { loadUsers } = require("./mock/user");

// product controllers
const {
  addProduct,
  loadProducts,
  updateProduct,
  removeProduct,
} = require("./mock/products");

const app = express();

// app config
app.use(cors({ origin: "*" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// endpoints
app.post("/login", (req, res) => {
  const { userId, password } = req.body;

  const users = loadUsers();
  const user = users.find(
    (u) => u.userId === userId && u.password === password
  );

  res.json({ success: !!user, data: user });
});

app.get("/auth", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  const users = loadUsers();
  const user = users.find((u) => u.token === token);

  res.json({ success: !!user, data: user });
});

app.post("/add-entry", (req, res) => {
  // see if token is valid
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("Not authorized");
  }

  // generate product entry
  const { productName, calorie, price, date } = req.body.data;
  const product = { productName, calorie, date, price };

  // add product
  const productAdded = addProduct(token, product);

  res.json({ success: !!productAdded, data: productAdded });
});

app.post("/add-product", (req, res) => {
  // see if token is valid
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("Not authorized");
  }

  // find user
  const { product, userId } = req.body.data;
  const users = loadUsers();
  const user = users.find((u) => u.userId === userId);

  // add product
  const productAdded = addProduct(user.token, product);

  res.json({
    success: !!productAdded,
    data: { product: productAdded, user },
  });
});

app.post("/update-product", (req, res) => {
  // see if token is valid
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).send("Not authorized");
  }

  const { product, userId } = req.body.data;

  // find user
  const users = loadUsers();
  const user = users.find((u) => u.userId === userId);

  // update product
  const productUpdated = updateProduct(user.token, product);

  res.json({ success: !!productUpdated, data: productUpdated });
});

app.post("/remove-product", (req, res) => {
  // see if token is valid
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).send("Not authorized");
  }

  const { entryId, userId } = req.body.data;

  // find user
  const users = loadUsers();
  const user = users.find((u) => u.userId === userId);

  // remove product
  const result = removeProduct(user.token, entryId);

  res.json({ success: result });
});

app.get("/products", (req, res) => {
  // see if token is valid
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).send("Not authorized");
  }

  // get products
  const products = loadProducts();
  const productsForUser = products.find((prod) => prod.userToken === token);

  res.json({ data: productsForUser?.entries || [] });
});

app.get("/all-products", (req, res, next) => {
  // see if token is valid
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).send("Not authorized");
  }

  // find user
  const users = loadUsers();
  const authUser = users.find((u) => u.token === token);

  // load products
  const products = loadProducts();

  // see if user is admin
  if (!authUser?.isAdmin) {
    res.status(403).send("Forbidden");
  } else {
    const data = products.map((prod) => {
      const user = users.find((u) => u.token === prod.userToken);
      return {
        user: { userId: user.userId, userName: user.userName },
        entries: prod.entries,
      };
    });

    res.json({ data });
  }
});

app.listen(4000, () => {
  console.log("Listing on port 4000");
});
