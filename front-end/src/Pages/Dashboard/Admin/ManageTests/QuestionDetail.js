// QuestionDetail.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosTests from "../../../../utils/axiosTests";
import Sidebar from "../Sidebar";
import Navbar from "../NavBarAdmin";
import './QuestionDetail.css';

export default function QuestionDetail() {
    const { QuestionID } = useParams();
    const [question, setQuestion] = useState({ QuestionText: "" });
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState({ AnswerText: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchQuestionAndAnswers = async () => {
            try {
                const responseQuestion = await axiosTests.get(`/app/questions/${QuestionID}/`);
                setQuestion(responseQuestion.data);

                const responseAnswers = await axiosTests.get(`/app/questions/${QuestionID}/answers/`);
                setAnswers(responseAnswers.data);
            } catch (error) {
                console.error("There was an error fetching the question or answers!", error);
            }
        };

        fetchQuestionAndAnswers();
    }, [QuestionID]);

    const handleChange = (e) => {
        setNewAnswer({ ...newAnswer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosTests.post(`/app/questions/${QuestionID}/answers/`, newAnswer);
            setMessage("Answer created successfully!");

            setNewAnswer({ AnswerText: "" });

            const { data } = await axiosTests.get(`/app/questions/${QuestionID}/answers/`);
            setAnswers(data);
        } catch (error) {
            console.error("There was an error creating the answer!", error);
        }
    };

    const handleDelete = async (AnswerID) => {
        try {
            await axiosTests.delete(`/app/answers/${AnswerID}/`);
            setMessage("Answer deleted successfully!");
            const { data } = await axiosTests.get(`/app/questions/${QuestionID}/answers/`);
            setAnswers(data);
        } catch (error) {
            console.error("There was an error deleting the answer!", error);
        }
    };

    return (
        <div className="containers">
            <Navbar />
            <Sidebar />
            <div className="question-detail">
                <h1>Question Detail</h1>
                <h2>{question.QuestionText}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h4>Answer Text:</h4>
                        <input type="text" name="AnswerText" value={newAnswer.AnswerText} onChange={handleChange} required />
                    </div>
                    <button type="submit">Add Answer</button>
                </form>
                {message && <p>{message}</p>}
                <div className="answer-list">
                    <h2>Answers</h2>
                    <ul>
                        {answers.map(answer => (
                            <li key={answer.AnswerID} className="answer-box">
                                <span>{answer.AnswerText}</span>
                                <div>
                                    <button className="delete-button" onClick={() => handleDelete(answer.AnswerID)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
