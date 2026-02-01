import { useEffect, useState } from "react";
import Auth from "./Auth";


const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

//token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState(null);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        return;
      }

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitTask = async (e) => {
    e.preventDefault();

    const options = {
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    };

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        ...options,
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        ...options,
      });
    }

    setForm({ title: "", description: "", status: "Pending" });
    setEditingId(null);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const statusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString();

  // not authenticating blocking UI
  if (!isAuthenticated) {
  return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📝 Task Manager</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsAuthenticated(false);
            }}
            className="text-sm text-red-600"
          >
            Logout
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={submitTask}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title"
            className="border p-2 rounded"
            required
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded md:col-span-2"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <button className="md:col-span-4 bg-indigo-600 text-white rounded py-2">
            {editingId ? "✏️ Update Task" : "➕ Add Task"}
          </button>
        </form>

        {/* TASK LIST */}
        <ul className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">
              No tasks found
            </p>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                className="border rounded p-4 flex justify-between bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600">
                    {task.description}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {formatDate(task.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Updated: {formatDate(task.updatedAt)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}



