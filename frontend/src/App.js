import React, { useState, useEffect } from "react";
import "./App.css"; // You can include your own CSS file for styling
import axios from "axios";

function App() {
  const [activeMenu, setActiveMenu] = useState("product");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from API when the component mounts
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
          apiKEY: process.env.apiKeySoyal,
        },
      };
      const response = await axios.get("10.2.7.14:3000/api/foods", axiosConfig);
      console.log(response);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`localhost:3000/api/foods/${productId}`);
      fetchProducts(); // Refresh the product list after deleting
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My React App</h1>
      </header>
      <div className="App-menu">
        <button
          className={activeMenu === "product" ? "active" : ""}
          onClick={() => setActiveMenu("product")}
        >
          Product
        </button>
        <button
          className={activeMenu === "transaction" ? "active" : ""}
          onClick={() => setActiveMenu("transaction")}
        >
          Transaction
        </button>
      </div>
      <div className="App-content">
        {activeMenu === "product" && (
          <div className="product-page">
            <h2>Products</h2>
            <ul className="product-list">
              {products.map((product) => (
                <li key={product.id}>
                  <img src={product.photo} alt={product.name} />
                  <div className="product-info">
                    <p>{product.name}</p>
                    <p>Price: ${product.price}</p>
                    <button onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeMenu === "transaction" && (
          <div className="transaction-page">
            <h2>Transactions</h2>
            {/* Transaction content goes here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
