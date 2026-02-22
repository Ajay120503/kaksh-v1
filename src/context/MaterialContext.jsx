import { createContext, useContext, useState } from "react";

const MaterialContext = createContext();

export const MaterialProvider = ({ children }) => {
  const [materials, setMaterials] = useState(null); // 🔹 ALL materials
  const [materialsByClass, setMaterialsByClass] = useState({}); // 🔹 per class

  return (
    <MaterialContext.Provider
      value={{
        materials,
        setMaterials,
        materialsByClass,
        setMaterialsByClass,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
};

export const useMaterial = () => {
  const context = useContext(MaterialContext);
  if (!context) {
    throw new Error("useMaterial must be used inside MaterialProvider");
  }
  return context;
};
