import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import {doc, setDoc,updateDoc, serverTimestamp } from "firebase/firestore";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();//preventing page refresh
    setLoading(true);

    try {
      // Create user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      if (user) {
        // Send verification email
        await sendEmailVerification(user);

        // Store user in Firestore
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          name: name,
          verified: false,
          createdAt: serverTimestamp(),
        });

        toast.info("Verification email sent !  Please verify within 5 minutes. Do not refresh this page and wait for few moments after clicking the link .", {
          position: "top-center",
          autoClose: 300000,
        });

        // Wait for verification or deletion
        let attempts = 0;
        while (attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 secs

          await user.reload(); // Refresh user data to check

          if (user.emailVerified) {
            toast.success("Email verified ! Redirecting to Home...", {
              position: "top-center",
            });

            await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds to display success

            await updateDoc(doc(db,"Users",user.uid),{verified:true})
            navigate("/home");
            return;
          }

          attempts++;
        }

        // If not verified in 5 minutes, delete user
        await deleteUser(user);
        toast.error("Unverified account deleted after 5 minutes.", {
          position: "top-center",
        });
      }

    } catch (error) {
      toast.error(error.code.replace("auth/", ""), { position: "top-center" });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-flex d-lg-flex justify-content-center">
      <form
        className="border rounded-3 m-3 mt-5 p-3 position-relative"
        onSubmit={handleSubmit}
        style={{ minWidth: "300px" }}
      >
        <ToastContainer />

        <div className="position-absolute top-0 start-50 translate-middle-x fs-3 fw-bold">
          Register
        </div>

        <div className="mb-4 mt-5">
          <label className="form-label fs-5">Name</label>
          <input
            type="text"
            className="form-control border"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="my-4">
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
            placeholder="Choose a new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mb-4" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" ></span>
          ) : (
            "Submit"
          )}
        </button>

        <div>* If you have registered already, please <Link to='/login'>Login</Link> here.</div>
      </form>
    </div>
  );
};

export default Register;
