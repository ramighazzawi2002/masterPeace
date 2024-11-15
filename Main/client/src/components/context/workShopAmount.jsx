import React, { createContext, useState, useContext } from "react";

const WorkshopContext = createContext();

export const useWorkshopContext = () => useContext(WorkshopContext);

export const WorkshopProvider = ({ children }) => {
  const [workshopAmount, setWorkshopAmount] = useState(0);
  const [workshopId, setWorkshopId] = useState(0);

  return (
    <WorkshopContext.Provider
      value={{ workshopAmount, setWorkshopAmount, workshopId, setWorkshopId }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};
