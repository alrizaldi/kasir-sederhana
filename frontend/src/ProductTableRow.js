// ProductTableRow.js
import React from "react";

const ProductTableRow = ({ product, onDelete }) => {
  return (
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>
        <img src={product.photo} alt={product.name} />
      </td>
      <td>${product.price}</td>
      <td>
        <button onClick={() => onDelete(product.id)}>Delete</button>
      </td>
    </tr>
  );
};

export default ProductTableRow;
