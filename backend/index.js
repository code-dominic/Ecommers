const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Review = require('./models/Review');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Call this as a function

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/E-commers")
  .then(() => {
    console.log("MongoDB connected");

    // Start server only after DB connects
    app.listen(5000, () => console.log("Server started on port 5000"));
  })
  .catch((err) => console.error(err));

// Routes






app.get('/', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.status(200).json(products);        
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



app.post('/', async (req, res) => {
  console.log(req.body); 
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json({ message: 'Product received!', data: req.body }); 
});

app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const product = await Product.findById(id).populate('reviews');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/products/:id/review' , async(req ,res)=>{
    console.log("review" , req.body);
    const productId = req.params.id;

    const review = new Review(req.body);
    await review.save();
    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id }
    });
    res.status(201).json({message : 'review recordred'});
})

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Find the product first
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Delete all related reviews
    await Review.deleteMany({ _id: { $in: product.reviews } });

    // 3. Delete the product itself
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product and related reviews deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
    }

    console.log(username  , email , hashedPassword);
    const newUser = new User({  username, email, password: hashedPassword });
    await newUser.save();
    console.log("user saved!!");

    const token = jwt.sign({ id: newUser._id }, "1234", { expiresIn: '1h' });
    

    return res.status(201).json({ token, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "User Already Exists!!" });
  }
});

app.post('/login' , async(req,res)=>{
    const { username , password} = req.body;
    console.log(req.body);

    const user = await User.findOne({username} );
    if(!user) return( res.status(400).json({ error : "invalid cridantials"}));

    const isValidPassword = await bcrypt.compare(password , user.password);
    if(!isValidPassword) return res.status(400).json({error : "invalid cridantials"});

    const token = jwt.sign({id : user._id} , "1234" , {expiresIn : '1h'});

    res.json({token});  
    
})
