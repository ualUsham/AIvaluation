import React, { useEffect, useState } from 'react';

const Analyse = () => {
    const [text, setText] = useState(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await fetch('http://localhost:5000/analyse');
                const result = await response.json();

                setText(result.geminiAnalysis);
                
            } catch (error) {
                setText(`Error fetching analysis: ${error.message}`);
            }
        };

        fetchAnalysis();
    }, []); 

    return (
        <div>
            <h2>AI Resume Analysis</h2>
            <p>{text ? text : "Loading..."}</p>
        </div>
    );
};

export default Analyse;
