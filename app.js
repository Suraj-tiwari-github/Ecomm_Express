//* our packages
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

//* requiring our models.
const Product=require('./models/product');
const User=require('./models/user');
const Review=require('./models/review');

mongoose.connect("mongodb://localhost:27017/ecomm")
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.log(err);
  });


const methodOverride = require("method-override");


  app.engine("ejs", ejsMate);
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  //for parsing application/json and www from urlencoded
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride("_method"));
  app.use(express.static(path.join(__dirname, "public")));





  //!RESTFUL routes.
app.get('/',(req,res)=>{
    res.render('home');
})

app.get("/product/new", async (req, res) => {
  res.render("products/new");
});
app.post('/product', async(req,res)=>{
  const product=new Product(req.body.product);
  await product.save();
  res.redirect(`/product/${product._id}`);
  
})


app.get('/product',async(req,res)=>{
  const prod=await Product.find({});
  // await prod.save();
  // res.send(p);
  res.render('products/index.ejs', {prod});
})

//show route.
app.get('/product/:id', async(req,res)=>{
  const p=await Product.findById(req.params.id);
  res.render('products/show', {p})
})

app.get('/product/:id/edit', async(req,res)=>{
  const prod=await Product.findById(req.params.id);
  res.render('products/edit', {prod})
})

app.put('/product/:id', async(req,res)=>{
  const { id } = req.params;
    const prod = await Product.findByIdAndUpdate(id, {
      ...req.body.prod
    });
    // req.flash('success', 'Successfully Updated Your Product.')
    res.redirect(`/product/${prod._id}`);
})

app.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    // req.flash("success", "Your Discussion Page has been Deleted successfully");
    res.redirect('/product');
  });


app.listen(3000, () => {
  console.log("Serving on Port 3000");
});