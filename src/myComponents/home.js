import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
  const [file, setFile] = useState(null);
  const [verify, setVerify] = useState(null); // null = loading, true/false = verified status
  const [user, setUser] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  // Check verification status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setVerify(userData.verified || false);
          } else {
            setVerify(false);
          }
        } catch (error) {
          alert("Error: " + error.message);
          setVerify(false);
        }
      } else {
        setVerify(false);
      }
    });

    return () => unsubscribe();
  }, []);




  // Handle email verification
  const handleVerify = async () => {
    try {
      await sendEmailVerification(user);
      setVerificationSent(true);

      toast.info("Verification email sent! Please verify within 5 minutes.", {
        position: "top-center",
        autoClose: 300000,
      });

      let attempts = 0;
      while (attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30s wait
        await user.reload();

        if (user.emailVerified) {
          toast.success("Email verified successfully!", { position: "top-center" });
          await updateDoc(doc(db, "Users", user.uid), { verified: true });
          setVerify(true);
          return;
        }

        attempts++;
      }

      toast.error("Verification timed out. Please try again.", {
        position: "top-center",
      });
      setVerificationSent(false); // Allow resending

    } catch (error) {
      toast.error('Please try again later...',{
        position: "top-center",
      });
      setVerificationSent(false);
    }
  };

// login again
const handleLogin=async ()=>{
  await signOut(auth);
  navigate('/login');
}

  const handleSubmit = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (error) {
        alert(error.message);
      }
    }
  };



  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    await handleUpload(selectedFile);
  };

  const handleUpload = async (selectedFile) => {
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      await fetch("https://aivaluation.onrender.com/upload", {
        method: 'POST',
        body: formData
      });

      toast.success("PDF uploaded successfully! Redirecting...", { position: "top-center" });
      await new Promise(resolve => setTimeout(resolve, 3000));
      setFile(null);
      navigate('/analyse');
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setFile(null);
    }
  };

  //  While verification status is loading
  if (verify === null) {
    return <p className="text-center mt-5 fs-4">Loading...</p>;
  }

  return (
    verify ? (
      <div>
        {/* Profile icon */}
        <div>
          <button className="btn position-absolute top-0 end-0 mt-4 me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop">
            <i className="fa-solid fa-user fa-2xl" style={{ color: "white" }}></i>
          </button>
          <div className="offcanvas offcanvas-end" data-bs-backdrop="static" id="staticBackdrop">
            <div className="offcanvas-header">
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div className="offcanvas-body">
              <Link className='btn' to="/profile">Profile</Link>
              <hr />
              <button className="btn" onClick={handleSubmit}>Sign Out</button>
              <hr />
            </div>
          </div>
        </div>

        {/* Home content */}
        <div className="container mt-5 text-center">
          <h1 className="fs-1 fw-bolder">Evaluate Your Interview Preparation with AI</h1>
          <p className="lead">Just upload your resume and get an AI-powered interview assessment !!</p>
          <br />
          <div className="d-flex justify-content-center">
            <ToastContainer />
            <label className="btn btn-dark rounded-4 px-5 py-3 fs-3 fw-bold">
              {file ? "Uploading..." : "Upload Resume"}
              <input type="file" accept=".pdf" onChange={handleFileChange} hidden disabled={file} />
            </label>
          </div>
          <br />
          <p className="text-muted mt-3">
            ** File must be in <strong>.pdf</strong> format. We do <strong>not</strong> store your file and is used only for analysis and question generation.
          </p>
        </div>
      </div>
    ) : (
      <div className="container text-center mt-5">
        <ToastContainer />
        <h2 className="mb-3 text-success">Please verify your email first to continue</h2>
        <br/>
        <button className="btn btn-dark" onClick={handleVerify} disabled={verificationSent}>{verificationSent ? "Verification Email Sent..." : "Send Verification Link"} </button>
        <br/><br/>
        <button className="btn btn-dark" onClick={handleLogin} disabled={verificationSent}>Login</button>
      </div>
    )
  );
};

export default Home;
