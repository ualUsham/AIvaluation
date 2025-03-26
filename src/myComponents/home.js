import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Sign out
  const handleSubmit = async () => {
    const confirmLogout = window.confirm("Are you sure you want to sign out?");
    if (confirmLogout) {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Handle file selection and auto-submit
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Automatically submit the form
    await handleUpload(selectedFile);
  };

  // File upload to backend
  const handleUpload = async (selectedFile) => {
    if (!selectedFile) {
      alert("No file uploaded");
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      await fetch("https://aivaluation.onrender.com/upload", { 
        method: 'POST', 
        body: formData 
      });

      toast.success("PDF uploaded successfully! Redirecting...", { position: "top-center" });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setFile(null);
      navigate('/analyse');
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setFile(null);
    }
  };

  return (
    <>
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
        <br/>
        <div className="d-flex justify-content-center">
          <ToastContainer />
          <label className="btn btn-dark rounded-4 px-5 py-3 fs-3 fw-bold">
            {file ? "Uploading..." : "Upload Resume"}
            <input type="file" accept=".pdf" onChange={handleFileChange} hidden disabled={file} />
          </label>
        </div>
        <br/>
        <p className="text-muted mt-3">
          ** File must be in <strong>.pdf</strong> format. We do <strong>not</strong> store your file and is used only for analysis and question generation.
        </p>
      </div>
    </>
  );
};

export default Home;
