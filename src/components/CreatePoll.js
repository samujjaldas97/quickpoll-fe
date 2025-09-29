import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Backend API URL
const API_BASE_URL = "https://quickpoll-backend-gijv.onrender.com/api"; 

function CreatePoll() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const filteredOptions = options.filter(opt => opt.trim() !== '');

        if (question.trim() === '' || filteredOptions.length < 2) {
            setError('Please provide a question and at least two non-empty options.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/polls`, {
                question,
                options: filteredOptions
            });
            const newPollId = response.data.uniqueId;
            navigate(`/poll/${newPollId}`);
        } catch (err) {
            setError('Failed to create poll. Please try again.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Create a New Poll</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Poll Question:</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>
                <div className="options-container">
                    <label>Options:</label>
                    {options.map((option, index) => (
                        <div className="form-group" key={index}>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addOption} className="btn btn-secondary">
                        Add Another Option
                    </button>
                </div>
                <button type="submit" className="btn btn-primary">Create Poll</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default CreatePoll;