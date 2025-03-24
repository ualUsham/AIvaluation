import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

const Interview = () => {
    const navigate =useNavigate();
    const questions = [];

    // Retrieve stored questions from sessionStorage
    for (let i = 0; i < 10; i++) {
        const question = sessionStorage.getItem(`question_${i + 1}`);
        if (question) {
            questions.push(question);
        }
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [completed, setCompleted] = useState(false);

    //handling questions one by one
    const handleNextQuestion = () => {
        // Store in sessionStorage with the question as the key & answer as value
        sessionStorage.setItem(questions[currentIndex], answer);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setAnswer('');
        } else {
            setCompleted(true);
        }
    };

    //go to evaluation
    const handleGetScore=()=>{
        navigate('/evaluate')
    }
    return (
        <div>
            <h2>Interview</h2>

            {completed ? (
                <>
                    <h3>Interview Completed! 🎉</h3>
                    <button className='btn btn-primary' onClick={handleGetScore}>Get Score</button>
                </>

            ) : (
                <>
                    <p>Question {currentIndex + 1}: {questions[currentIndex]}</p>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={4}
                        cols={50}
                    />
                    <br />
                    <button onClick={handleNextQuestion} disabled={!answer.trim()}>
                        {currentIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                    </button>
                </>
            )}
        </div>
    );
};

export default Interview;

