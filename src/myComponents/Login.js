import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { auth } from './firebase';
import { signInWithEmailAndPassword,onAuthStateChanged,sendPasswordResetEmail } from 'firebase/auth';



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //if already logged in, go to Home 
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });
  
    return () => unsubscribe(); // Clean up listener
  }, [navigate]);

  //Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login Successful! Redirecting to Home...", {
        position: "top-center",
      });

      await new Promise((resolve) => { setTimeout(resolve, 3000) }) //wait 3s to display success message

      navigate("/home");

    } catch (error) {
      toast.error(error.code.replace("auth/", ""), { position: "top-center" });

      setPassword("");

    } finally {
      setLoading(false)
    }
  }
  //Password change
  const handlePasswordChange = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent ! Check your email.", { position: "top-center" });
      setEmail('');
  } catch (error) {
      toast.error(error.code)
  }
}


  return (
    <div className="container-flex d-lg-flex justify-content-center">
      <form
        className="border rounded-3 m-3 mt-5 p-3 position-relative"
        onSubmit={handleSubmit}
        style={{ minWidth: "300px" }}
      >
        <ToastContainer />

        <div className="position-absolute top-0 start-50 translate-middle-x fs-3 fw-bold"> Sign In </div>

        <div className="mb-3 mt-5">
          <label className="form-label fs-5">Email</label>
          <input
            type="email"
            className="form-control border"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="my-4">
          <label className="form-label fs-5">Password</label>
          <input
            type="password"
            className="form-control border"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mb-4" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" ></span>
          ) : (
            "Sign In"
          )}
        </button>

        <div>* Not registered already? <Link to='/register' style={{textDecoration:'none'}}>Register</Link> here.</div>
        <div>*<Link to='' onClick={handlePasswordChange} style={{textDecoration:'none'}}> Forgot Password?</Link></div>

      </form>
    </div>
  )
}

export default Login


