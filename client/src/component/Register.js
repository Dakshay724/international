import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("DOB", DOB);
    formData.append("hobbies", hobbies);
    formData.append("password", password);
    formData.append("projects", projects);
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:9000/api/createUser", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Signup successful");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setProjects([]);
        setHobbies([]);
        setSelectedImage(null);

        navigate(`/VerifyOtp/${email}`);
      } else {
        console.log("Signup failed");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              value={DOB}
              onChange={(event) => setDOB(event.target.value)}
            />
          </label>
          <label>
            email:
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Hobbies:
            <input
              type="text"
              value={hobbies}
              onChange={(event) => setHobbies(event.target.value)}
            />
          </label>
          <label>
            Projects:
            <input
              type="text"
              value={projects}
              onChange={(event) => setProjects(event.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label className="upload-button-signup">
            Select Profile Picture
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <button type="submit">Register</button>
        </>
      )}
    </form>
  );
}
export default Register;
