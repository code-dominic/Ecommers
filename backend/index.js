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



const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "1234", (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};





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


app.post('/products/cart/:id', auth, async (req, res) => {
  const { id } = req.params; // product ID
  const { Qty } = req.body;  // quantity

  try {
    const user = await User.findById(req.userId);

    // Check if product is already in cart
    const existingItem = user.cart.find(item => item.productOrdered.toString() === id);
    if (existingItem) {
      existingItem.Qty += Qty; // increase quantity
    } else {
      user.cart.push({ productOrdered: id, Qty });
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

app.put('/products/:id' , async (req , res)=>{
    const {id} = req.params;

    const { name , description , cost , imageUrl} = req.body;

    try{

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set : {name , description , imageUrl , cost}},
        { new: true, runValidators: true }
      );

      if(!updatedProduct){
        return res.status(404).json({ message : "Product not Found"});
      }

      res.status(200).json({
        message : "Product updated successfully",
        product: updatedProduct
      });
    }catch(err){
      res.status(500).json({
        message : "Server Error",
        error : err
      })
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



app.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('cart.productOrdered'); // fetch product details

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/cart/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.cart = user.cart.filter(
      item => item.productOrdered.toString() !== req.params.id
    );

    await user.save();
    res.status(200).json({ message: 'Item removed', cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





