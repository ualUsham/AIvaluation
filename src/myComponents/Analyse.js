import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Analyse = () => {
    const [summary, setSummary] = useState(null);
    const fetched = useRef(false); //  Prevent multiple fetches
    const navigate=useNavigate();

    useEffect(() => {
        if (fetched.current) return; //  Skip fetch if already called
        fetched.current = true;

        const fetchAnalysis = async () => {
            try {
                const response = await fetch('http://localhost:5000/analyse');
                const result = await response.json();

                if(result.geminiAnalysis){
                    sessionStorage.setItem('summary', result.geminiAnalysis)
                }     
                setSummary(sessionStorage.getItem('summary'));

                //handle allQuestion strings to convert to questionsArray
                const allQuestions = result.questions;
                try {
                    const jsonMatch = allQuestions.match(/\[.*\]/s);

                    if (jsonMatch) {

                        const validJson = jsonMatch[0];
                        const questionsArray = JSON.parse(validJson);

                        //store allQuestions in sessionStorage to ask one by one 
                        questionsArray.forEach((question, index) => {
                            sessionStorage.setItem(`question_${index + 1}`, question);
                        });

                    } else {
                        console.error("No valid JSON array found in the string.");
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

    const handleInterview=()=>{
        navigate('/interview');
    }

    return (
        <div>
            <h2>Summary</h2>
            <p>{summary ? summary : "Loading Summary..."}</p>
            <button className='btn btn-primary ms-5' onClick={handleInterview} >Start Interview</button>
        </div>
    );
};

export default Analyse;
