import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assignmentService from "../../services/assignmentService";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useAssignment } from "../../context/AssignmentContext";

export default function CreateAssignment() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const { setAssignmentsByClass } = useAssignment();

  if (user?.role !== "teacher") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="px-6 py-4 bg-red-100 text-red-500 font-bold rounded-lg">
          You are not allowed to create assignments
        </div>
      </div>
    );
  }

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingFile(true);
      const res = await api.post("/upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setAttachments((prev) => [...prev, res.data.fileUrl]);
      toast.success("File uploaded successfully");
    } catch {
      toast.error("File upload failed");
    } finally {
      setUploadingFile(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!title || !deadline) {
  //     return toast.error("Fill required fields");
  //   }
  //   setLoading(true);

  //   try {
  //     await assignmentService.createAssignment({
  //       classId,
  //       title: title.trim(),
  //       description: description?.trim(),
  //       deadline,
  //       ...(maxMarks !== "" && { maxMarks: Number(maxMarks) }),
  //       attachments: attachments.filter(Boolean),
  //     });

  //     toast.success("Assignment created successfully!");
  //     navigate(`/assignments/${classId}`);
  //   } catch (err) {
  //     toast.error(err?.response?.data?.msg || "Failed to create assignment");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !deadline) {
      return toast.error("Fill required fields");
    }
    setLoading(true);

    try {
      const newAssignment = await assignmentService.createAssignment({
        classId,
        title: title.trim(),
        description: description?.trim(),
        deadline,
        ...(maxMarks !== "" && { maxMarks: Number(maxMarks) }),
        attachments: attachments.filter(Boolean),
      });

      setAssignmentsByClass((prev) => ({
        ...prev,
        [classId]: [newAssignment, ...(prev[classId] || [])],
      }));

      toast.success("Assignment created successfully!");
      navigate(`/assignments/${classId}`);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex justify-center items-center">
      <div className="w-full max-w-2xl card bg-base-100 border border-base-300 shadow-xl rounded-2xl">
        <div className="card-body p-8">
          <h1 className="text-3xl font-bold text-center">
            📚 Create Assignment
          </h1>
          <p className="text-center opacity-70 mb-4">
            Fill the details below to create a new assignment
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Assignment Title <span className="text-error">*</span>
                </span>
              </label>
              <input
                className="input input-bordered w-full"
                placeholder="Enter assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Write assignment instructions"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Deadline + Marks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Deadline <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Max Marks</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="100"
                  min="1"
                  max="100"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                />
              </div>
            </div>

            {/* Attachment Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Attach File (Optional)
                </span>
              </label>

              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={uploadFile}
              />

              {uploadingFile && (
                <div className="mt-2 text-sm text-primary flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading file...
                </div>
              )}
            </div>

            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="bg-base-300 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Attached Files</h3>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((a, i) => (
                    <span
                      key={i}
                      className="badge badge-primary badge-lg break-all px-4 py-2"
                    >
                      File {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-sm btn-outline"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-sm btn-primary flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                {loading ? "Creating..." : "Create Assignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
