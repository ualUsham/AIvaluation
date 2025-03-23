import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
  const [file, setFile] = useState(null)
  const navigate = useNavigate();

  //signout
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
  }

  //upload file from device
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //file upload to backend
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("No file uploaded");
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch("http://localhost:5000/upload", { method: 'POST', body: formData });
      // const result = await response.text();
      toast.success("Pdf file uploaded successfully!! Redirecting...", { position: "top-center" });
      setFile(false);
      await new Promise((resolve) => { setTimeout(resolve, 3000) });
      navigate('/analyse');

    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    }

  }

  return (
    <>
      {/* profile icon*/}
      <div>
        <button class="btn position-absolute top-0 end-0 mt-4 me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
          <i class="fa-solid fa-user fa-2xl" style={{ color: "white" }}></i>
        </button>
        <div class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
          <div class="offcanvas-header">
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <Link className='btn' to="/profile">Profile</Link>
            <br></br>
            <hr />
            <button className="btn" onClick={handleSubmit}>Sign Out</button>
            <hr />
          </div>
        </div>
      </div>
      {/* Home content */}
      <div className='d-flex'>
        <div className='w-50'>
          <h1>Evaluate Your Interview Preparation Just by Uploading your Resume</h1>
          <p>File must be in .pdf format. Remember we do not store information about your resume and information is used
            only to analyse and ask interview questions !!
          </p>
        </div>
        <div className=''>
          < ToastContainer/>
          <h2>Upload Resume</h2>
          <form onSubmit={handleUpload}>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button type='submit' className='btn btn-primary' disabled={!file}>Upload</button>
          </form>
        </div>
      </div>

    </>
  )
}

export default Home
