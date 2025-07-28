import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDesciption] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  // Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDesciption] = useState("");

  const apiUrl = "https://todo-focus-tracker.onrender.com";

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos([...todos, newTodo]); // Now using the returned item with _id
          setTitle("");
          setDesciption("");
          setMessage("Item added successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    } else {
      setError("Both title and description are required.");
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        setError("Unable to fetch todo items.");
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDesciption(item.description);
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => res.json())
        .then((updatedItem) => {
          const updatedTodos = todos.map((item) =>
            item._id === editId ? updatedItem : item
          );
          setTodos(updatedTodos);
          setEditTitle("");
          setEditDesciption("");
          setEditId(-1);
          setMessage("Item updated successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => {
          setError("Unable to update Todo item");
        });
    } else {
      setError("Both title and description are required.");
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
    setEditTitle("");
    setEditDesciption("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.filter((item) => item._id !== id);
            setTodos(updatedTodos);
            setMessage("Item deleted successfully");
            setTimeout(() => setMessage(""), 3000);
          } else {
            setError("Failed to delete the item.");
          }
        })
        .catch(() => {
          setError("Unable to delete Todo item");
        });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="container-fluid bg-success text-white py-4 text-center shadow-sm">
        <h1 className="display-5 fw-bold">🌟 TODO - FocusTracker</h1>
      </div>

      <div className="container my-4">
        {/* Add Item Section */}
        <div className="bg-light p-4 rounded shadow-sm">
          <h3 className="text-primary">Add a New Task</h3>
          {message && <p className="text-success fw-semibold">{message}</p>}
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <input
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className="form-control"
                type="text"
              />
            </div>
            <div className="col-md-5">
              <input
                placeholder="Description"
                onChange={(e) => setDesciption(e.target.value)}
                value={description}
                className="form-control"
                type="text"
              />
            </div>
            <div className="col-md-3 d-grid">
              <button className="btn btn-dark" onClick={handleSubmit}>
                ➕ Add Task
              </button>
            </div>
          </div>
          {error && <p className="text-danger mt-2 fw-semibold">{error}</p>}
        </div>

        {/* Tasks List */}
        <div className="mt-5">
          <h3 className="text-secondary">📋 Your Tasks</h3>
          <div className="row">
            <div className="col-12">
              <ul className="list-group">
                {todos.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center bg-white shadow-sm rounded my-2 p-3"
                  >
                    <div className="flex-grow-1 me-3">
                      {editId === -1 || editId !== item._id ? (
                        <>
                          <h5 className="mb-1 text-dark fw-bold">
                            {item.title}
                          </h5>
                          <p className="mb-0 text-muted">{item.description}</p>
                        </>
                      ) : (
                        <div className="row g-2">
                          <div className="col-md-6">
                            <input
                              placeholder="Title"
                              onChange={(e) => setEditTitle(e.target.value)}
                              value={editTitle}
                              className="form-control"
                              type="text"
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              placeholder="Description"
                              onChange={(e) => setEditDesciption(e.target.value)}
                              value={editDescription}
                              className="form-control"
                              type="text"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 mt-md-0 d-flex gap-2 flex-wrap">
                      {editId === -1 || editId !== item._id ? (
                        <>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => handleEdit(item)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(item._id)}
                          >
                            🗑️ Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-outline-success"
                            onClick={handleUpdate}
                          >
                            ✅ Update
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={handleEditCancel}
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 