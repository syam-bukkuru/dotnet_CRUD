import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./api/studentApi";

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", course: "" });
  const [editingId, setEditingId] = useState(null);

  // Normalize backend PascalCase => camelCase
  const normalizeData = (data) =>
    data.map((s) => ({
      id: s.Id,
      name: s.Name,
      age: s.Age,
      course: s.Course,
    }));

  // Initial load
  useEffect(() => {
    getStudents();
  }, []);

  const fetchStudents = async () => {
    const data = await getStudents();
    setStudents(normalizeData(data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateStudent(editingId, form);
    } else {
      await createStudent(form);
    }

    setForm({ name: "", age: "", course: "" });
    setEditingId(null);
    fetchStudents();
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-5">Student Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow mb-6">
        <input
          className="w-full border p-2 mb-3"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.age}</td>
              <td className="border p-2">{s.course}</td>
              <td className="border p-2 flex gap-2 justify-center">

                <button
                  onClick={() => {
                    setForm(s);
                    setEditingId(s.id);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    await deleteStudent(s.id);
                    fetchStudents();
                  }}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
