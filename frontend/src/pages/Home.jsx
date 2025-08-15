import { useEffect, useState } from "react";
import axios from "axios";
// import HorizontalCard from '../components/HorizontalCard'
import HorizontalCard from "../components/HorizontalCard";
import HeroSection from "../section/HeroSection";

const Home = ({handelClick}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/");
      console.log("👉 Server response:", res.data); // 👈 log the data
      setProducts(res.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  fetchData();
}, []);



  return (
    <>
    <HeroSection/>

    <div
    style={{
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
}}
    
    >
  <div>
    <h1>Product List</h1>
    {Array.isArray(products) ? (
      products.map((product) => (
        <HorizontalCard  product={product}  handelClick={handelClick} key={product._id}/> 
        
      ))
    ) : (
      <p>Loading or no products found.</p>
    )}
  </div>
  </div>
  




</>
);
};

export default Home;
