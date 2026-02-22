import { createContext, useState, useEffect } from "react";
import classroomService from "../services/classroomService";
import toast from "react-hot-toast";
// import { useSocket } from "../hooks/useSocket";

export const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { socket } = useSocket();

  const loadMyClassrooms = async () => {
    try {
      const res = await classroomService.myClassrooms();
      setClassrooms(res);
    } catch (err) {
      console.log("Class Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyClassrooms();
  }, []);

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("refreshClassrooms", loadMyClassrooms);
  //   return () => socket.off("refreshClassrooms");
  // }, [socket]);

  const createClassroom = async (data) => {
    const res = await classroomService.createClassroom(data);
    toast.success("Classroom Created");
    loadMyClassrooms();
    return res;
  };

  const joinClassroom = async (code) => {
    const res = await classroomService.joinClassroom(code);
    toast.success("Joined Classroom");
    loadMyClassrooms();
    return res;
  };

  return (
    <ClassroomContext.Provider
      value={{
        classrooms,
        loading,
        loadMyClassrooms,
        createClassroom,
        joinClassroom,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};
