import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SocialButtons from './SocialButtons';
import { GoogleSignInButton } from './GoogleSignInButton';

export default function SignUp() {
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '', agree: false,role: 'student' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword || !form.agree) return;
    try {
      await axios.post('http://localhost:5000/signup', form);
      alert('Account created!');
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="page-layout">
      <div className="left-pane">
        <h1>WELCOME AT CAMPUSMATE</h1>
        <p>Providing universities information to all students across Pakistan.</p>
        <div className="auth-buttons">
           <SocialButtons />
           <GoogleSignInButton/>
        </div>
      </div>
      <div className="right-pane">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign up</h2>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="text" placeholder="User Name" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <div>
  <label>Select your role:</label><br />
  <label>
    <input type="radio" name="role" value="student" checked={form.role === 'student'} onChange={e => setForm({ ...form, role: e.target.value })} />
    Student
  </label><br />
  <label>
    <input type="radio" name="role" value="hostelManager" checked={form.role === 'hostelManager'} onChange={e => setForm({ ...form, role: e.target.value })} />
    Hostel Manager
  </label><br />
  <label>
    <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={e => setForm({ ...form, role: e.target.value })} />
    Admin
  </label>
</div>
          <label><input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} /> I have agreed to the terms and policies</label>
          <button type="submit">Sign up</button>
          <p style={{ color: "white", fontSize: "0.9rem" }}>
          Already have an account? <Link to="/signin" style={{ color: "#00bfff" }}>Sign in</Link>
          </p>
          
        </form>
      </div>
    </div>
  );
}