const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({id: newUser._id }, "1234", { expiresIn: "6h" });
    res.status(201).json({ token, message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "User Already Exists!!" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "1234", { expiresIn: "6h" });
  res.json({ token });
};
