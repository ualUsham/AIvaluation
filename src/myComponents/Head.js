import React from "react";
import { Link } from "react-router-dom";

export default function Head() {
    return (
        <div style={{ position: 'relative' }}>
            <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
                <div className="container-fluid d-flex flex-column ">
                    <Link className="navbar-brand fs-2 fw-bold ms-4" to="/">AIvaluation</Link>
                </div>
            </nav>
        </div>
    )
}