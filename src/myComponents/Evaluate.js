import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Evaluate = () => {
    const [score, setScore] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get questions and answers from session storage
        let questions = [];
        let answers = [];

        for (let i = 0; i < 10; i++) {
            const bundle = sessionStorage.getItem(`answer${i + 1}`);

            if (bundle) {
                const [ques, ans] = bundle.split('///'); 
                questions.push(ques);
                answers.push(ans);
            } else {
                questions.push("No question found"); 
                answers.push("No answer provided");
            }
        }

        // Send answers to backend for evaluation
        const fetchResult = async () => {
            try {
                const response = await fetch('http://localhost:5000/evaluate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ questions, answers })
                });

                const result = await response.text();
                setScore(result.split('[')[1].split(']')[0]);

                sessionStorage.clear();
            } catch (error) {
                setScore("Error fetching score.");
            }
        };

        fetchResult();

    }, []);

    const handleHome = ()=>{
        navigate('/home')
    }

    return (
        <>
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg py-5 w-50 text-center mt-5 rounded-4">
                <h2 className="fw-bold mb-4">Your Final Score</h2>
                <div className="fs-3 fw-bold">
                    {score ? (
                        <span className="text-success fw-bold">{score}</span>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-dark" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className='container text-center mt-5'>
            <button className="btn btn-dark rounded-3 fw-bold" onClick={handleHome}>Home</button>
        </div>
        
        </>
    );
};

export default Evaluate;
