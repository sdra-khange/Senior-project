import React, { useState, useEffect } from "react";
import axiosTests from "../../../../utils/axiosTests";
import Sidebar from "../Sidebar";
import Navbar from "../NavBarAdmin";
import { Link } from "react-router-dom";
import './ManageTests.css';

export default function ManageTests() {
    const [tests, setTests] = useState([]);
    const [newTest, setNewTest] = useState({ TestName: "" });
    const [editTest, setEditTest] = useState({ TestID: null, TestName: "" });
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const { data } = await axiosTests.get('/app/tests/');
                setTests(data);
            } catch (error) {
                console.error("There was an error fetching the tests!", error);
            }
        };

        fetchTests();
    }, []);

    const handleChange = (e) => {
        setNewTest({ ...newTest, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditTest({ ...editTest, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosTests.post('/app/tests/', newTest);
            setMessage("Test created successfully!");

            setNewTest({ TestName: "" });

            const { data } = await axiosTests.get('/app/tests/');
            setTests(data);
        } catch (error) {
            console.error("There was an error creating the test!", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosTests.put(`/app/tests/${editTest.TestID}/`, { TestName: editTest.TestName });
            setMessage("Test updated successfully!");

            setEditTest({ TestID: null, TestName: "" });
            setIsEditing(false);

            const { data } = await axiosTests.get('/app/tests/');
            setTests(data);
        } catch (error) {
            console.error("There was an error updating the test!", error);
        }
    };

    const handleDelete = async (TestID) => {
        try {
            await axiosTests.delete(`/app/tests/${TestID}/`);
            setMessage("Test deleted successfully!");
            const { data } = await axiosTests.get('/app/tests/');
            setTests(data);
        } catch (error) {
            console.error("There was an error deleting the test!", error);
        }
    };

    const startEdit = (test) => {
        setEditTest(test);
        setIsEditing(true);
    };

    return (
        <div className="containers">
            <Navbar />
            <Sidebar />
            <div className="manage-tests">
                <div className="test-create-form">
                    <h2>Create New Test</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h4>Test Name:</h4>
                            <input type="text" name="TestName" placeholder="Test Name" value={newTest.TestName} onChange={handleChange} required />
                        </div>
                        <button type="submit">Create Test</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
                <div className="test-list">
                    <h2>Existing Tests</h2>
                    <ul>
                        {tests.map(test => (
                            <li key={test.TestID} className="test-box">
                                {isEditing && editTest.TestID === test.TestID ? (
                                    <>
                                        <input
                                            type="text"
                                            name="TestName"
                                            value={editTest.TestName}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <button className="update-button" onClick={handleUpdate}>Update</button>
                                        <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{test.TestName}</span>
                                        <div>
                                            <button className="delete-button" onClick={() => handleDelete(test.TestID)}>Delete</button>
                                            <Link className="view-button" to={`/admin/manage-tests/${test.TestID}`}>Manage Questions</Link>
                                            <button className="edit-button" onClick={() => startEdit(test)}>Edit</button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}


