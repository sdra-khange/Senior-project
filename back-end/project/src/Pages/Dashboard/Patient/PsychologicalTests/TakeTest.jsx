import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../../utils/axiosProfile';
import { 
    FaArrowLeft, FaArrowRight, FaCheck, FaSave, 
    FaQuestionCircle, FaClock, FaExclamationTriangle 
} from 'react-icons/fa';
import './TakeTest.css';
import NavbarPatient from '../NavbarPatient';
import SidebarPatient from '../SidebarPatient';

const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    const [test, setTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [timeStarted, setTimeStarted] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        fetchTestDetails();
        setTimeStarted(new Date());
    }, [testId]);

    const fetchTestDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/app/patient/tests/${testId}/`);
            setTest(response.data);
            
            // Initialize answers object
            const initialAnswers = {};
            response.data.questions?.forEach(question => {
                initialAnswers[question.QuestionID] = null;
            });
            setAnswers(initialAnswers);
        } catch (error) {
            setMessage('Failed to load test details');
            console.error('Error fetching test:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answerId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const saveProgress = async () => {
        setIsSaving(true);
        try {
            const answersArray = Object.entries(answers)
                .filter(([questionId, answerId]) => answerId !== null)
                .map(([questionId, answerId]) => ({
                    question_id: parseInt(questionId),
                    selected_answer_id: parseInt(answerId)
                }));

            if (answersArray.length > 0) {
                await axios.post(`/app/patient/tests/${testId}/submit/`, {
                    answers: answersArray
                });
                setMessage('Progress saved successfully');
            }
        } catch (error) {
            setMessage('Failed to save progress');
            console.error('Error saving progress:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitTest = async () => {
        const unansweredQuestions = test.questions.filter(
            question => answers[question.QuestionID] === null
        );

        if (unansweredQuestions.length > 0) {
            setMessage(`Please answer all questions. ${unansweredQuestions.length} questions remaining.`);
            return;
        }

        try {
            // Save all answers first
            await saveProgress();
            
            // Complete the test
            await axios.post(`/app/patient/tests/${testId}/complete/`);
            setMessage('Test completed successfully!');
            
            setTimeout(() => {
                navigate('/patient/tests');
            }, 2000);
        } catch (error) {
            setMessage('Failed to submit test');
            console.error('Error submitting test:', error);
        }
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const getAnsweredCount = () => {
        return Object.values(answers).filter(answer => answer !== null).length;
    };

    const getProgressPercentage = () => {
        if (!test || !test.questions) return 0;
        return (getAnsweredCount() / test.questions.length) * 100;
    };

    const formatElapsedTime = () => {
        if (!timeStarted) return '00:00';
        const elapsed = Math.floor((new Date() - timeStarted) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="take-test-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading test...</p>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="take-test-error">
                <h2>Test not found</h2>
                <button onClick={() => navigate('/patient/tests')}>
                    Back to Tests
                </button>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className="take-test">
            <SidebarPatient />
            <NavbarPatient />
            
            <div className="test-container">
                <div className="test-header">
                    <div className="test-info">
                        <h1>{test.TestName}</h1>
                        <p>{test.TestDescription}</p>
                    </div>
                    
                    <div className="test-stats">
                        <div className="stat">
                            <FaClock />
                            <span>{formatElapsedTime()}</span>
                        </div>
                        <div className="stat">
                            <FaQuestionCircle />
                            <span>{getAnsweredCount()}/{test.questions.length}</span>
                        </div>
                    </div>
                </div>

                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                </div>

                {message && (
                    <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <div className="test-content">
                    <div className="question-navigation">
                        <div className="question-numbers">
                            {test.questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`question-number ${
                                        index === currentQuestionIndex ? 'current' : ''
                                    } ${
                                        answers[test.questions[index].QuestionID] !== null ? 'answered' : ''
                                    }`}
                                    onClick={() => goToQuestion(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="question-section">
                        <div className="question-header">
                            <h2>Question {currentQuestionIndex + 1} of {test.questions.length}</h2>
                        </div>

                        <div className="question-content">
                            <h3>{currentQuestion.QuestionText}</h3>
                            
                            <div className="answers-list">
                                {currentQuestion.answers.map((answer) => (
                                    <label 
                                        key={answer.AnswerID} 
                                        className={`answer-option ${
                                            answers[currentQuestion.QuestionID] === answer.AnswerID ? 'selected' : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion.QuestionID}`}
                                            value={answer.AnswerID}
                                            checked={answers[currentQuestion.QuestionID] === answer.AnswerID}
                                            onChange={() => handleAnswerSelect(currentQuestion.QuestionID, answer.AnswerID)}
                                        />
                                        <span className="answer-text">{answer.AnswerText}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="question-navigation-buttons">
                            <button 
                                className="nav-btn prev"
                                onClick={goToPreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                <FaArrowLeft /> Previous
                            </button>

                            <button 
                                className="save-btn"
                                onClick={saveProgress}
                                disabled={isSaving}
                            >
                                <FaSave /> {isSaving ? 'Saving...' : 'Save Progress'}
                            </button>

                            {currentQuestionIndex === test.questions.length - 1 ? (
                                <button 
                                    className="submit-btn"
                                    onClick={() => setShowConfirmModal(true)}
                                >
                                    <FaCheck /> Submit Test
                                </button>
                            ) : (
                                <button 
                                    className="nav-btn next"
                                    onClick={goToNextQuestion}
                                >
                                    Next <FaArrowRight />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="test-actions">
                    <button 
                        className="back-btn"
                        onClick={() => navigate('/patient/tests')}
                    >
                        <FaArrowLeft /> Back to Tests
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Submit Test</h3>
                        </div>
                        
                        <div className="modal-content">
                            <div className="warning-icon">
                                <FaExclamationTriangle />
                            </div>
                            <p>Are you sure you want to submit this test?</p>
                            <p>You have answered {getAnsweredCount()} out of {test.questions.length} questions.</p>
                            {getAnsweredCount() < test.questions.length && (
                                <p className="warning-text">
                                    You have {test.questions.length - getAnsweredCount()} unanswered questions.
                                </p>
                            )}
                            <p><strong>Once submitted, you cannot make changes.</strong></p>
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                className="btn-secondary"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleSubmitTest}
                            >
                                Submit Test
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TakeTest;
