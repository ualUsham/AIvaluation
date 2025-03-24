import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Interview = () => {
    const navigate = useNavigate();
    const questions = [];

    // Retrieve stored questions from sessionStorage
    for (let i = 0; i < 10; i++) {
        const question = sessionStorage.getItem(`question${i + 1}`);
        if (question) {
            questions.push(question);
        }
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [completed, setCompleted] = useState(false);

    // Handling questions one by one
    const handleNextQuestion = () => {
        sessionStorage.setItem(`answer${currentIndex + 1}`, `${questions[currentIndex]}///${answer}`);

        if (currentIndex < 9) {
            setCurrentIndex(currentIndex + 1);
            setAnswer('');
        } else {
            setCompleted(true);
        }
    };

    // Navigate to evaluation
    const handleGetScore = () => {
        navigate('/evaluate');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 w-80 mt-5 px-4">
                <h2 className="text-center fw-bold mb-4">Interview</h2>

                {completed ? (
                    <div className="text-center">
                        <h5 className="text-success mt-4 mb-5 ms-3 fs-5 fw-bold">Completed 🎉</h5>
                        <button className="btn btn-dark mt-3 px-4 py-2 fw-bold" onClick={handleGetScore}>
                            Get Final Score
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="fs-5 fw-semibold">Question {currentIndex + 1}: {questions[currentIndex]}</p>
                        <textarea
                            className="form-control"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={4}
                        />
                        <div className="text-center mt-4">
                            <button 
                                className="btn btn-dark px-4 py-2 fw-bold"
                                onClick={handleNextQuestion} 
                                disabled={!answer.trim()}
                            >
                                {currentIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interview;
