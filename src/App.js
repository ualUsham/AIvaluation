import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './myComponents/Register.js';
import Login from './myComponents/Login.js';
import Head from './myComponents/Head.js';
import Home from "./myComponents/home.js";
import Profile from "./myComponents/profile.js";
import Analyse from "./myComponents/Analyse.js";
import Interview from "./myComponents/Interview.js";
import Evaluate from "./myComponents/Evaluate.js";

function App() {
  return (
    <BrowserRouter>
      <Head/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/analyse" element={<Analyse/>}/>
        <Route path="/interview" element={<Interview/>}/>
        <Route path="/evaluate" element={<Evaluate/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;