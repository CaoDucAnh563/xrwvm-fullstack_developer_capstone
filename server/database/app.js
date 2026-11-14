const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const reviewsData = JSON.parse(fs.readFileSync("./data/reviews.json", "utf8"));
const dealershipsData = JSON.parse(fs.readFileSync("./data/dealerships.json", "utf8"));

let reviews = reviewsData.reviews || [];
let dealerships = dealershipsData.dealerships || [];

app.get("/", (req, res) => {
  res.send("Welcome to the Mongoose API");
});

app.get("/fetchReviews", (req, res) => {
  res.json(reviews);
});

app.get("/fetchReviews/dealer/:id", (req, res) => {
  const dealerId = parseInt(req.params.id, 10);
  const filtered = reviews.filter((r) => r.dealership === dealerId);
  res.json(filtered);
});

app.get("/fetchDealers", (req, res) => {
  res.json(dealerships);
});

app.get("/fetchDealers/:state", (req, res) => {
  const stateParam = req.params.state.toLowerCase();
  const filtered = dealerships.filter(
    (d) => d.state && d.state.toLowerCase() === stateParam
  );
  res.json(filtered);
});

app.get("/fetchDealer/:id", (req, res) => {
  const dealerId = parseInt(req.params.id, 10);
  const filtered = dealerships.filter((d) => d.id === dealerId);
  res.json(filtered);
});

app.post("/insert_review", (req, res) => {
  const data = req.body;
  const maxId = reviews.reduce((max, r) => (r.id > max ? r.id : max), 0);
  const newReview = {
    id: maxId + 1,
    name: data.name,
    dealership: parseInt(data.dealership, 10),
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year,
  };
  reviews.push(newReview);
  res.json(newReview);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
