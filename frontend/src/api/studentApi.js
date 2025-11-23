const BASE_URL = process.env.VITE_API_URL;

// GET all students
export const getStudents = async () => {
  const res = await fetch(BASE_URL);

  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

// CREATE student
export const createStudent = async (student) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
};

// UPDATE student
export const updateStudent = async (id, student) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
};

// DELETE student
export const deleteStudent = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) throw new Error("Failed to delete student");
  return res.ok;
};
