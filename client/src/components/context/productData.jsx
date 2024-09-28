import React, { createContext, useState, useContext } from "react";

const productContext = createContext();
export const useProductContext = () => useContext(productContext);
export const ProductProvider = ({ children }) => {
  const [productId, setProductId] = useState([]);
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState([]);
  return (
    <productContext.Provider
      value={{
        productId,
        setProductId,
        amount,
        setAmount,
        quantity,
        setQuantity,
      }}
    >
      {children}
    </productContext.Provider>
  );
};
