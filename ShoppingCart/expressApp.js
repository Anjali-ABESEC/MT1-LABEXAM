import express from "express";
const app = express();
app.use(express.json());

let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
  { id: 2, productName: "Notebook", price: 60, quantity: 5, category: "Stationery" },
  { id: 3, productName: "Water Bottle", price: 250, quantity: 1, category: "Home" },
];

const withTotal = (item) => ({ ...item, total: item.price * item.quantity });

app.get("/cart", (req, res) => res.json(cart.map(withTotal)));

app.get("/cart/:id", (req, res) => {
  const item = cart.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: "Product not found" });
  res.json(withTotal(item));
});

app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;
  if (!id || !productName || !price || !quantity || !category)
    return res.status(400).json({ message: "All fields are required" });
  if (cart.some((i) => i.id === id))
    return res.status(400).json({ message: "ID already exists" });
  const product = { id, productName, price, quantity, category };
  cart.push(product);
  res.status(201).json({ message: "Product added successfully", product });
});

app.put("/cart/:id", (req, res) => {
  const item = cart.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: "Product not found" });
  const { productName, price, quantity, category } = req.body;
  if (productName) item.productName = productName;
  if (price) item.price = price;
  if (quantity) item.quantity = quantity;
  if (category) item.category = category;
  res.json({ message: "Product updated successfully", product: withTotal(item) });
});

app.delete("/cart/:id", (req, res) => {
  const index = cart.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  cart.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
});

app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});