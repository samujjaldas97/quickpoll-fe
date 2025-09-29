import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Backend API URL
const API_BASE_URL = "https://quickpoll-backend-gijv.onrender.com/api";

function PollPage() {
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [voted, setVoted] = useState(false);
    const { uniqueId } = useParams();

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/polls/${uniqueId}`);
                setPoll(response.data);
                if (localStorage.getItem(`voted_${uniqueId}`)) {
                    setVoted(true);
                }
            } catch (err) {
                setError('Poll not found or an error occurred.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();
    }, [uniqueId]);

    const handleVote = async (optionId) => {
        if (voted) return;

        try {
            await axios.post(`${API_BASE_URL}/polls/vote/${optionId}`);
            setVoted(true);
            localStorage.setItem(`voted_${uniqueId}`, 'true');
            const updatedOptions = poll.options.map(opt => 
                opt.id === optionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
            );
            setPoll({ ...poll, options: updatedOptions });
        } catch (err) {
            setError('Failed to cast vote.');
            console.error(err);
        }
    };
    
    if (loading) return <p>Loading poll...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!poll) return null;

    const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0);

    return (
        <div className="poll-page-container">
            <h2>{poll.question}</h2>
            {voted ? (
                <div>
                    <h3>Results</h3>
                    {poll.options.map(option => {
                        const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                        return (
                            <div key={option.id} className="result-item">
                                <p>{option.optionText}: {option.voteCount} vote(s)</p>
                                <div className="result-bar-container">
                                    <div 
                                        className="result-bar"
                                        style={{ width: `${percentage}%` }}
                                    >
                                        {Math.round(percentage)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <p>Total Votes: {totalVotes}</p>
                </div>
            ) : (
                <div>
                    <h3>Cast your vote:</h3>
                    {poll.options.map(option => (
                        <button
                            key={option.id}
                            className="vote-option"
                            onClick={() => handleVote(option.id)}
                        >
                            {option.optionText}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PollPage;