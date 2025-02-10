// app/context/ChamaContext.js
import React from "react";

const ChamaContext = React.createContext();

export const ChamaProvider = ({ chamaId, children }) => {
  return (
    <ChamaContext.Provider value={chamaId}>
      {children}
    </ChamaContext.Provider>
  );
};

export const useChamaId = () => {
  const context = React.useContext(ChamaContext);
  if (!context) {
    throw new Error("useChamaId must be used within a ChamaProvider");
  }
  return context;
};