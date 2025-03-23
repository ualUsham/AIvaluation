import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';


const Profile = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    // fetch user data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "Users", user.uid));
                    setUserData(userDoc.data());
                } catch (error) {
                    alert(error.code);
                }
            }
        });

        return () => unsubscribe();
    }, []);
    //sign out
    const handleSignOut = async () => {
        const confirmLogout = window.confirm("Are you sure you want to sign out?");
        if (confirmLogout) {
            try {
                await signOut(auth);
                navigate('/login');
            } catch (error) {
                alert(error.code);
            }
        }
    };

    //delete account
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Do you want to permanently delete your account?");
        if (confirmDelete) {
            const user = auth.currentUser;
            if (!user) { 
                navigate("/login");

            };
            try {
                await deleteUser(user);
                toast.success("Account deletion successful", { position: "top-center" });
                await updateDoc(doc(db, "Users", user.uid), { verified: false });
                await new Promise((resolve) => { setTimeout(resolve, 2000) });
                navigate('/login');
            } catch (error) {
                alert(error.code)
            }
        }
    };

    return (
        <>
            {/* Display user data */}
            <div className="container-flex d-lg-flex justify-content-center">
                <div className="border rounded-4 m-2 mt-5 p-3 pb-5" style={{ minWidth: "300px" }}>
                    <ToastContainer />
                    <h1 className='text-center'>Profile</h1>
                    <br />
                    <hr />
                    {userData ? (
                        <div>
                            <p><strong>Name :</strong> {userData.name}</p>
                            <p><strong>Email :</strong> {userData.email}</p>
                            <p><strong>Verified :</strong> {userData.verified ? "Yes" : "No"}</p>
                            <hr />
                            <button className="btn btn-danger position-absolute start-50 translate-middle-x" onClick={handleDelete}>Delete Account </button>
                            <br />
                            <br />
                            <br />
                            <button className="btn btn-secondary position-absolute start-50 translate-middle-x" onClick={handleSignOut}>Sign Out </button>
                        </div>
                    ) : (
                        <>
                            <span className="spinner-border spinner-border-sm" ></span>
                            <button className="btn btn-danger position-absolute start-50 translate-middle-x" onClick={handleDelete}>Delete Account </button>
                        </>
                    )}
                </div>
            </div>

            {/* Home Button */}
            <div className='position-absolute top-0 end-0 me-4 mt-4'>

                <Link to="/home" className="text-white fs-5" style={{ textDecoration: "none" }}>Home</Link>
            </div>
        </>
    );
};

export default Profile;
