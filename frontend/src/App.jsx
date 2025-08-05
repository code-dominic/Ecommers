import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from './pages/Home';
import Product from "./pages/product";
import FormElement from "./pages/FormElement";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import UseToken from "./app/UseToken";
import Register from "./pages/Register";

function App() {
  const { token , setToken} = UseToken();
  const [productID, setProductID] = useState(""); // ✅ fixed useState
  const navigate = useNavigate(); // ✅ useNavigate must be inside component

  const handelClick = (proID) => {
    setProductID(proID);
    navigate("/product");
  };

  return (
    <>
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home handelClick={handelClick} />} />
        <Route path="/product" element={<Product productId={productID}/>} />
        <Route path="/form" element={<FormElement />} />
        <Route path="/login" element={<Login token={token}  setToken={setToken}/>} />
        <Route path ="/register" element ={<Register token={token} setToken={setToken} />} />

      </Routes>


      
    </>
  );
}

export default App;
