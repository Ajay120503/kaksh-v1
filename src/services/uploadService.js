import api from "./api";

const uploadService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", file.type);

    const res = await api.post("/upload/upload", formData);

    return {
      fileUrl: res.data.fileUrl,
      fileType: res.data.fileType,
    };
  },
};


export default uploadService;
