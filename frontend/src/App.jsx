import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from './pages/Home';
import Product from "./pages/Products/Product";
import FormElement from "./pages/FormElement";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import UseToken from "./app/UseToken";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import AdminLogin from "./AdminPages/AdminLogin";
import Dashboard from "./AdminPages/Dashboard";
import UserPage from "./AdminPages/UserPage";
import AdminPage from "./AdminPages/AdminPage";
import AdminOrdersPage from "./AdminPages/AdminOrdersPage";
import Orders from './pages/Orders'
// import HeroSection from "./section/HeroSection";

function App() {
  const { token , setToken} = UseToken();
  const [productID, setProductID] = useState(""); // ✅ fixed useState
  const navigate = useNavigate(); // ✅ useNavigate must be inside component

  const handelClick = (proID) => {
    // alert('handelclick!!');
    setProductID(proID);
    localStorage.setItem("lastProductId", proID);
    navigate("/products");
  };

  return (
    <>
      <Navbar token={token} setToken={setToken}/>

      

      <Routes>
        <Route path="/" element={<Home handelClick={handelClick} />} />
        <Route path="/products" element={<Product token={token} productID={productID} setProductID={setProductID}/>} />
        <Route path="/product" element={<Product token={token} productId={productID} />} />
        <Route path="/form" element={<FormElement />} />
        <Route path="/login" element={<Login token={token}  setToken={setToken}/>}  />
        <Route path ="/register" element ={<Register token={token} setToken={setToken} />} />
        <Route path ="/cart" element ={<Cart token={token}/>} />
        <Route path="/adminlogin"  element={<AdminLogin token={token}  setToken={setToken}/>} />
        <Route path="/dashboard" element = {<Dashboard/>} />
        <Route path="/dashboard/users" element = {<UserPage/>} />
        <Route path="/dashboard/admins" element={<AdminPage/>}/>
        <Route path="/dashboard/orders" element={<AdminOrdersPage token={token}/>}/>
        <Route path="/orders" element={<Orders token={token}/>}/>
      </Routes>

    </>
  );
}

export default App;
