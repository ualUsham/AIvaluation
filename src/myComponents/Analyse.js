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
                const response = await fetch('https://aivaluation.onrender.com/analyse');
                
                // Ensure response is valid JSON
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const result = await response.json();
    
                console.log("API Response:", result); //  Debugging response
    
                // Validate response structure
                if (result.geminiAnalysis) {
                    sessionStorage.setItem('summary', result.geminiAnalysis);
                    setSummary(result.geminiAnalysis);
                } else {
                    throw new Error("geminiAnalysis not found in response");
                }
    
                if (result.questions) {
                    try {
                        console.log("Raw Questions:", result.questions); // ✅ Debugging questions response
    
                        // Ensure result.questions is a proper JSON array
                        if (Array.isArray(result.questions)) {
                            result.questions.forEach((question, index) => {
                                sessionStorage.setItem(`question${index + 1}`, question);
                            });
                        } else {
                            console.error("Questions format is incorrect:", result.questions);
                        }
                    } catch (error) {
                        console.error("Error parsing questions JSON:", error);
                    }
                } else {
                    console.warn("No questions found in API response.");
                }
    
            } catch (error) {
                console.error("Error fetching analysis:", error);
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
