import React, { useEffect, useState } from "react";
import "./Update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateUser = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // Get existing user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/user/${id}`
        );

        const data = response.data;

        setUser({
          name: data.name || "",
          email: data.email || "",
          address: data.address || data.adress || "",
        });
      } catch (error) {
        console.log("Error fetching user:", error);
        toast.error("Unable to load user");
      }
    };

    fetchUser();
  }, [id]);

  // Handle input changes
  const inputHandler = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  // Update user
  const submitForm = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/update/user/${id}`,
        user
      );

      toast.success("User updated successfully!");

      navigate("/");
    } catch (error) {
      console.log("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="addUser">

      {/* Back Button */}
      <Link to="/" className="btn btn-secondary">
        <i className="fa-solid fa-backward"></i>
        Back
      </Link>

      {/* Update Form */}
      <form className="addUserForm" onSubmit={submitForm}>

        {/* Name */}
        <div className="inputGroup">
          <label htmlFor="name">Name :</label>

          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={inputHandler}
            autoComplete="off"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email */}
        <div className="inputGroup">
          <label htmlFor="email">Email :</label>

          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={inputHandler}
            autoComplete="off"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Address */}
        <div className="inputGroup">
          <label htmlFor="address">Address :</label>

          <input
            type="text"
            id="address"
            name="address"
            value={user.address}
            onChange={inputHandler}
            autoComplete="off"
            placeholder="Enter your address"
            required
          />
        </div>

        {/* Submit */}
        <div className="inpurGroup">
          <button type="submit" className="btn btn-primary">
            Update User
          </button>
        </div>

      </form>
    </div>
  );
};

export default UpdateUser;