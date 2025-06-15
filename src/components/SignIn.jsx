import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleSignInButton } from './GoogleSignInButton';
import SocialButtons from './SocialButtons';

export default function SignIn({ setToken }) {
  const [form, setForm] = useState({ emailOrUsername: '', password: '', stayLoggedIn: false });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/signin', form);
    const { token, role } = res.data; 

    localStorage.setItem('token', token);
    setToken(token);

    if (role === 'student') navigate('/home');
    else if (role === 'admin') navigate('/admin');
    else if (role === 'hostelManager') navigate('/hostelmanager');
    else navigate('/'); 

  } catch (err) {
    const errorMessage = err?.response?.data?.error || 'Login failed. Please try again.';
    alert(errorMessage);
  }
};

  return (
    <div className="page-layout">
      <div className="left-pane">
        <p><strong style={{fontSize:'30px'}}>Welcome Back to Campus Mate, </strong>  your trusted companion in education</p>
        <div className="auth-buttons">
          <SocialButtons/>
          <GoogleSignInButton/>
        </div>
      </div>
      <div className="right-pane">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign in</h2>
          <input type="text" placeholder="Email Or Username" value={form.emailOrUsername} onChange={(e) => setForm({ ...form, emailOrUsername: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <label><input type="checkbox" checked={form.stayLoggedIn} onChange={(e) => setForm({ ...form, stayLoggedIn: e.target.checked })} /> Stay Log In</label>
          <button type="submit">Sign in</button>
           <p style={{ color: "white", fontSize: "0.9rem" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#00bfff" }}>Sign up</Link>
        </p>
        </form>
      </div>
    </div>
  );
}