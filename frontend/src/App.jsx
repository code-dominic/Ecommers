import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import Orders from './pages/Orders';
import AdminProductsList from "./AdminPages/AdminProductsList";
import AdminProductPages from "./AdminPages/AdminProductPages";
import AdminLayout from "./layouts/AdminLayout"; // ✅ new layout
import AdminCancellation from "./AdminPages/AdminCancellation";

function App() {
  const { token , setToken } = UseToken();
  const [productID, setProductID] = useState("");
  const navigate = useNavigate();

  const handelClick = (proID) => {
    setProductID(proID);
    localStorage.setItem("lastProductId", proID);
    navigate("/products");
  };

  return (
    <>
      <Navbar token={token} setToken={setToken} />

      <Routes>
        {/* Public/User Routes */}
        <Route path="/" element={<Home handelClick={handelClick} />} />
        <Route path="/products" element={<Product token={token} productID={productID} setProductID={setProductID}/>} />
        <Route path="/product" element={<Product token={token} productId={productID} />} />
        
        <Route path="/login" element={<Login token={token} setToken={setToken}/>} />
        <Route path="/register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/cart" element={<Cart token={token}/>} />
        <Route path="/orders" element={<Orders token={token}/>} />
        

        {/* Admin Login */}
        <Route path="/adminlogin" element={<AdminLogin token={token} setToken={setToken}/>} />

        {/* Admin Routes wrapped in AdminLayout */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserPage />} />
          <Route path="admins" element={<AdminPage />} />
          <Route path="orders" element={<AdminOrdersPage token={token}/>} />
          <Route path="cancellations" element={<AdminCancellation token={token} />}/>
          <Route path="products-list" element={<AdminProductsList token={token} setProductID={setProductID}/>} />
          <Route path="products-list/views" element={<AdminProductPages token={token} productID={productID}/>} />
          <Route path="addproducts" element={<FormElement token={token}  />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
