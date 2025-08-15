import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from './pages/Home';
import Product from "./pages/product";
import FormElement from "./pages/FormElement";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import UseToken from "./app/UseToken";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
// import HeroSection from "./section/HeroSection";

function App() {
  const { token , setToken} = UseToken();
  const [productID, setProductID] = useState(""); // ✅ fixed useState
  const navigate = useNavigate(); // ✅ useNavigate must be inside component

  const handelClick = (proID) => {
    setProductID(proID);
    localStorage.setItem("lastProductId", proID);
    navigate("/products");
  };

  return (
    <>
      <Navbar token={token} setToken={setToken}/>

      

      <Routes>
        <Route path="/" element={<Home handelClick={handelClick} />} />
        <Route path="/products" element={<Product token={token} productId={productID} />} />
        <Route path="/product" element={<Product token={token} productId={productID} />} />
        <Route path="/form" element={<FormElement />} />
        <Route path="/login" element={<Login token={token}  setToken={setToken}/>} />
        <Route path ="/register" element ={<Register token={token} setToken={setToken} />} />
        <Route path ="/cart" element ={<Cart token={token}/>} />
      </Routes>

    </>
  );
}

export default App;
