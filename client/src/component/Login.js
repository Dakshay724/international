import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function loginUser(email, password) {
    let payload = { email: email, password: password };
    await fetch("http://localhost:9000/api/userLogin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((resp) => resp.json())
      .then((data) => {
        localStorage.setItem("AccessToken", JSON.stringify(data.token));
        console.log(data);
        if (data.success === true) {
          navigate("/Download");
        }
      })
      .catch((error) => console.log(error));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(email, password);
    loginUser(email, password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        email:
        <input
          type="text"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
      <button type="submit">Login</button>
      <Link to="/register">
        <h3>register</h3>
      </Link>
    </form>
  );
}

export default Login;
