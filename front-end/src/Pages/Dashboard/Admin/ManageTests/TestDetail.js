import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosTests from "../../../../utils/axiosTests";
import Sidebar from "../Sidebar";
import Navbar from "../NavBarAdmin";
import './TestDetail.css';
import { Link } from "react-router-dom";


export default function TestDetail() {
    const { TestID } = useParams();
    const [test, setTest] = useState({ TestName: "" });
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ QuestionText: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTestAndQuestions = async () => {
            try {
                const responseTest = await axiosTests.get(`/app/tests/${TestID}/`);
                setTest(responseTest.data);

                const responseQuestions = await axiosTests.get(`/app/tests/${TestID}/questions/`);
                setQuestions(responseQuestions.data);
            } catch (error) {
                console.error("There was an error fetching the test or questions!", error);
            }
        };

        fetchTestAndQuestions();
    }, [TestID]);

    const handleChange = (e) => {
        setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosTests.post(`/app/tests/${TestID}/questions/`, newQuestion);
            setMessage("Question created successfully!");

            setNewQuestion({ QuestionText: "" });

            const { data } = await axiosTests.get(`/app/tests/${TestID}/questions/`);
            setQuestions(data);
        } catch (error) {
            console.error("There was an error creating the question!", error);
        }
    };

    const handleDelete = async (QuestionID) => {
        try {
            await axiosTests.delete(`/app/questions/${QuestionID}/`);
            setMessage("Question deleted successfully!");
            const { data } = await axiosTests.get(`/app/tests/${TestID}/questions/`);
            setQuestions(data);
        } catch (error) {
            console.error("There was an error deleting the question!", error);
        }
    };

    return (
        <div className="containers">
            <Navbar />
            <Sidebar />
            <div className="test-detail">
                <h1>Test Detail</h1>
                <h2>{test.TestName}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h4>Question Text:</h4>
                        <input type="text" name="QuestionText" value={newQuestion.QuestionText} onChange={handleChange} required />
                    </div>
                    <button type="submit">Add Question</button>
                </form>
                {message && <p>{message}</p>}
                <div className="question-list">
                    <h2>Questions</h2>
                    <ul>
                        {questions.map(question => (
                            <li key={question.QuestionID} className="question-box">
                                <span>{question.QuestionText}</span>
                                <div>
                                    <button className="delete-button" onClick={() => handleDelete(question.QuestionID)}>Delete</button>
                                    <Link className="view-button" to={`/admin/manage-questions/${question.QuestionID}`}>Manage Answers</Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
