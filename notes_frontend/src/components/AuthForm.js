import React, { useState } from "react";

// PUBLIC_INTERFACE
function AuthForm({ onLogin, onRegister, error, loading }) {
  /** Auth form (login/register), minimal. */
  const [loginMode, setLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (loginMode) {
      onLogin(username, password);
    } else {
      onRegister(username, password);
    }
  }
  return (
    <div className="authform-outer">
      <form className="authform" onSubmit={handleSubmit}>
        <h2>{loginMode ? "Login" : "Register"}</h2>
        <label>
          Username
          <input
            disabled={loading}
            type="text"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            disabled={loading}
            type="password"
            autoComplete={loginMode ? "current-password" : "new-password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? (loginMode ? "Logging in..." : "Registering...") : loginMode ? "Login" : "Register"}
        </button>
        <div className="authform-switch">
          {loginMode ? (
            <>No account?{" "}
              <button type="button" className="btn btn-link" onClick={() => setLoginMode(false)}>
                Register
              </button>
            </>
          ) : (
            <>Have an account?{" "}
              <button type="button" className="btn btn-link" onClick={() => setLoginMode(true)}>
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
export default AuthForm;
