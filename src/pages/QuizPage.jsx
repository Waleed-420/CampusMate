import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseQuizResponse, validateQuizQuestions } from '../utils/quizParser';
import './QuizPage.css';
import LoadingText from '../components/LoadingText';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const QuizPage = () => {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [showRecommendation, setShowRecommendation] = useState(false);
  useEffect(() => {
    handleStartQuiz();
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/quiz", { replace: true });
    }
  }, []);

  const handleStartQuiz = async () => {
    setLoading(true);
    setError('');
    setQuestions([]);
    setAnswers([]);
    setResult('');
    setShowRecommendation(false);
    setStep(1);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
          messages: [
            {
              role: 'system',
              content: 'You are a quiz generator for career counseling. Generate output in valid JSON format only.',
            },
            {
              role: 'user',
              content: 'Create 5 multiple-choice questions (4 options each) to help a Pakistani student choose a suitable bachelor\'s degree. Format your response as a valid JSON array: [{question: string, options: string[]}] and nothing else.',
            },
          ],
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const quizData = parseQuizResponse(response.data);
      validateQuizQuestions(quizData);
      setQuestions(quizData);
    } catch (err) {
      console.error('Quiz loading error:', err);
      setError(`Failed to load initial quiz: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleNext = async () => {
    if (step === 1) {
      setLoading(true);
      try {
        const summary = questions.map((q, i) =>
          `${q.question} Answer: ${q.options[answers[i]]}`
        ).join('\n');

        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
            messages: [
              {
                role: 'system',
                content: 'You are a quiz generator for career counseling. Generate output in valid JSON format only.',
              },
              {
                role: 'user',
                content: `Given these answers:\n${summary}\nGenerate 5 more personalized multiple-choice questions (4 options each) about career choices. Return ONLY the JSON array: [{question: string, options: string[]}]`,
              },
            ],
            response_format: { type: 'json_object' },
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const quizData = parseQuizResponse(response.data);
        validateQuizQuestions(quizData);
        setQuestions(quizData);
        setAnswers([]);
        setStep(2);
      } catch (err) {
        console.error('Follow-up questions error:', err);
        setError(`Failed to load follow-up questions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const fullSummary = questions.map((q, i) =>
          `${q.question} Answer: ${q.options[answers[i]]}`
        ).join('\n');

        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
            messages: [
              {
                role: 'system',
                content: 'You are a Pakistani career advisor AI. Provide only the recommended degree program in this exact format: " Degree Name". Do not include any additional explanation, reasoning or bold style and special characters.',
              },
              {
                role: 'user',
                content: `Based on these answers:\n${fullSummary}\nRecommend one bachelor's degree program just programs name and abbrevation`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setResult(response.data.choices[0].message.content);
        setShowRecommendation(true);
      } catch (err) {
        console.error('Recommendation error:', err);
        setError('Error generating recommendation.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="quiz-wrapper">
        {error && <p className="error-text">{error}</p>}

        {loading && <LoadingText text="CampusMate" />}

        {!questions.length && !loading && !showRecommendation && (
          <button className="start-button" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        )}

        {questions.length > 0 && !showRecommendation && !loading && (
          <div>
            <h1 className='main-head'>Career Quiz for Pakistani Students</h1>
            <h2>Step {step}: Answer these questions</h2>
            <div className="quiz-container">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="quiz-card">
                  <p className="quiz-question">{qIndex + 1}. {q.question}</p>
                  {q.options.map((opt, i) => {
                    const isSelected = answers[qIndex] === i;
                    return (
                      <label
                        key={i}
                        className={`quiz-option ${isSelected ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`q-${qIndex}`}
                          value={i}
                          checked={isSelected}
                          onChange={() => handleAnswer(qIndex, i)}
                          style={{ display: 'none' }}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>

            <button
              className="next-button"
              onClick={handleNext}
              disabled={answers.length !== questions.length || answers.includes(undefined)}
            >
              {step === 1 ? 'Next 5 Questions' : 'Get Recommendation'}
            </button>
          </div>
        )}

        {showRecommendation && (
          <div className="recommendation-overlay">
            <div className="recommendation-box">
              <h1>Your Recommendation</h1>
              <p>
  We recommend you according to your answers the following program: <span className='digree'>{result}</span>
</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};


export default QuizPage;
