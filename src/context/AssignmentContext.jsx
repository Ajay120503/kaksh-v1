import { createContext, useContext, useState } from "react";

const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState(null); // for AllAssignmentList
  const [assignmentsByClass, setAssignmentsByClass] = useState({}); // per class

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        setAssignments,
        assignmentsByClass,
        setAssignmentsByClass,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignment = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error("useAssignment must be used inside AssignmentProvider");
  }
  return context;
};
