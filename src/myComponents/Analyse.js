import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Analyse = () => {
    const [summary, setSummary] = useState(null);
    const fetched = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (fetched.current) return; 
        fetched.current = true;

        const fetchAnalysis = async () => {
            try {
                const response = await fetch('http://localhost:5000/analyse');
                const result = await response.json();

                if (result.geminiAnalysis) {
                    sessionStorage.setItem('summary', result.geminiAnalysis);
                }
                setSummary(sessionStorage.getItem('summary'));

                const allQuestions = result.questions;
                try {
                    const jsonMatch = allQuestions.match(/\[.*\]/s);

                    if (jsonMatch) {
                        const validJson = jsonMatch[0];
                        const questionsArray = JSON.parse(validJson);
                        questionsArray.forEach((question, index) => {
                            sessionStorage.setItem(`question${index + 1}`, question);
                        });
                    } else {
                        console.error("No valid JSON array found.");
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }

            } catch (error) {
                setSummary(`Error fetching analysis: ${error.message}`);
            }
        };

        fetchAnalysis();
    }, []);

    const handleInterview = () => {
        navigate('/interview');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center my-5">
            <div className="card shadow-lg p-3 w-78 ">
                <h2 className="text-center fw-bold mb-3">Candidate Summary</h2>

                <div className="py-3 px-3 bg-light rounded text-center">
                    {summary ? (
                        <p>{summary}</p>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mt-4">
                    <button 
                        className="btn btn-dark px-4 py-2 fw-bold" 
                        onClick={handleInterview} 
                        disabled={!summary}
                    >
                        Start Interview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analyse;
