"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const emptyForm = {
  name: "",
  age: "",
  gender: "",
  mobile: "",
  email: "",
  department: "",
};

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if user is not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Get all students
  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();

      if (response.ok) {
        setStudents(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load students");
    }
  };

  // Load students after login
  useEffect(() => {
    if (status === "authenticated") {
      fetchStudents();
    }
  }, [status]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.mobile ||
      !form.email ||
      !form.department
    ) {
      alert("Please fill all fields");
      return;
    }

    if (form.name.trim().length < 2) {
      alert("Name must be at least 2 characters");
      return;
    }

    if (Number(form.age) < 1 || Number(form.age) > 100) {
      alert("Age must be between 1 and 100");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      alert("Mobile number must be 10 digits");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const method = editingId !== null ? "PUT" : "POST";

      const data = {
        ...form,
        ...(editingId !== null && { id: editingId }),
      };

      const response = await fetch("/api/students", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error);
        return;
      }

      alert(
        editingId !== null
          ? "Student updated successfully!"
          : "Student added successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);

      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      age: student.age,
      gender: student.gender,
      mobile: student.mobile,
      email: student.email,
      department: student.department,
    });

    setEditingId(student.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error);
        return;
      }

      alert("Student deleted successfully!");

      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  // Check login
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Checking login...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              Student Management
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Manage your student records
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-lg">
              <span className="text-blue-400 text-sm">
                Students: {students.length}
              </span>
            </div>

            <button
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
              className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Student Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8">

          <h2 className="text-xl font-semibold">
            {editingId !== null ? "Edit Student" : "Add New Student"}
          </h2>

          <p className="text-slate-400 text-sm mt-1 mb-6">
            {editingId !== null
              ? "Update student information"
              : "Enter student details"}
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >

            {/* Name */}
            <div>
              <label className="text-sm text-slate-300">
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={(e) => {
                  const value = e.target.value.replace(
                    /[^a-zA-Z\s]/g,
                    ""
                  );

                  setForm({
                    ...form,
                    name: value,
                  });
                }}
                placeholder="Enter full name"
                required
                className="input"
              />
            </div>

            {/* Age */}
            <div>
              <label className="text-sm text-slate-300">
                Age
              </label>

              <input
                name="age"
                type="number"
                min="1"
                max="100"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter age"
                required
                className="input"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm text-slate-300">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm text-slate-300">
                Mobile
              </label>

              <input
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setForm({
                    ...form,
                    mobile: value,
                  });
                }}
                placeholder="Enter mobile number"
                maxLength={10}
                required
                className="input"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-slate-300">
                Email
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                maxLength={100}
                required
                className="input"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-sm text-slate-300">
                Department
              </label>

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select department</option>
                <option value="Computer Science">
                  Computer Science
                </option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Electronics">
                  Electronics
                </option>
                <option value="Mechanical">
                  Mechanical
                </option>
                <option value="Civil">
                  Civil
                </option>
                <option value="Electrical">
                  Electrical
                </option>
              </select>
            </div>

            {/* Buttons */}
            <div className="lg:col-span-3 flex gap-3">

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 px-6 py-3 rounded-xl font-medium transition"
              >
                {loading
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Student"
                  : "Add Student"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </div>

        {/* Student Records */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">

          <div className="px-6 py-5 border-b border-slate-800">

            <h2 className="text-xl font-semibold">
              Student Records
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              View and manage all students
            </p>

          </div>

          {students.length === 0 ? (

            <div className="py-16 text-center">

              <div className="text-5xl mb-4">
                👨‍🎓
              </div>

              <h3 className="text-lg font-medium">
                No students yet
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Add your first student using the form above.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-950">

                  <tr className="text-left text-sm text-slate-400">

                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4">Gender</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {students.map((student) => (

                    <tr
                      key={student.id}
                      className="border-t border-slate-800 hover:bg-slate-800/50"
                    >

                      <td className="px-6 py-4 font-medium">
                        {student.name}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {student.age}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs">
                          {student.gender}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {student.mobile}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {student.email}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {student.department}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500 hover:text-white px-3 py-2 rounded-lg text-sm transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(student.id)
                            }
                            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-sm transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>
    </div>
  );
}