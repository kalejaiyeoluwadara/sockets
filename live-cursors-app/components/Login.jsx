import React from "react";

function Login({ onSubmit }) {
  const [username, setUsername] = React.useState("");
  return (
    <main>
      <h1>Welcome</h1>
      <p>What should people call you</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(username);
        }}
      >
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Name"
        />
        <input type="submit" />
      </form>
    </main>
  );
}

export default Login;
