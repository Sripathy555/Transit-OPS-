import './App.css'

function App() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-section">
          <h1>Transit OPS</h1>
          <p>Manage your transit operations with confidence.</p>
        </div>

        <form className="login-form">
          <h2>Sign in</h2>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
          />

          <button type="submit">Login</button>

          <p className="helper-text">
            Forgot password? <a href="#">Reset it</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default App