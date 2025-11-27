import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import questionsData from '../data/questions.json';

// Utility to shuffle array
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const TestMode = ({ onBack }) => {
    const [phase, setPhase] = useState('setup'); // setup, active, results
    const [config, setConfig] = useState({
        type: 'formative', // formative, final
        module: 'Module 1',
        questionCount: 100, // percentage for final exam
    });

    const [examQuestions, setExamQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedOption }
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const modules = useMemo(() => {
        const mods = new Set(questionsData.map(q => q.module));
        return Array.from(mods).sort();
    }, []);

    const handleStartExam = () => {
        let filtered = [];
        if (config.type === 'formative') {
            filtered = questionsData.filter(q => q.module === config.module);
        } else {
            filtered = [...questionsData];
        }

        // Shuffle questions
        let shuffled = shuffleArray(filtered);

        // Apply count limit for Final Exam
        if (config.type === 'final') {
            const count = Math.ceil(shuffled.length * (config.questionCount / 100));
            shuffled = shuffled.slice(0, count);
        }

        // Shuffle options for each question
        const processed = shuffled.map(q => ({
            ...q,
            options: shuffleArray(q.options)
        }));

        setExamQuestions(processed);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setPhase('active');
    };

    const handleAnswer = (option) => {
        const currentQ = examQuestions[currentQuestionIndex];
        setUserAnswers(prev => ({
            ...prev,
            [currentQ.id]: option
        }));
    };

    const calculateScore = () => {
        let correct = 0;
        examQuestions.forEach(q => {
            if (userAnswers[q.id] === q.answer) correct++;
        });
        return correct;
    };

    if (phase === 'setup') {
        return (
            <div className="flex flex-col h-full max-w-lg mx-auto w-full justify-center">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={onBack} className="text-slate-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-white">Exam Setup</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Exam Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setConfig({ ...config, type: 'formative' })}
                                    className={`p-4 rounded-xl border text-left transition-all ${config.type === 'formative'
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    <div className="font-semibold">Formative</div>
                                    <div className="text-xs opacity-75 mt-1">Specific Module</div>
                                </button>
                                <button
                                    onClick={() => setConfig({ ...config, type: 'final' })}
                                    className={`p-4 rounded-xl border text-left transition-all ${config.type === 'final'
                                            ? 'bg-cyan-600 border-cyan-500 text-white'
                                            : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    <div className="font-semibold">Final Exam</div>
                                    <div className="text-xs opacity-75 mt-1">All Modules</div>
                                </button>
                            </div>
                        </div>

                        {config.type === 'formative' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Select Module</label>
                                <select
                                    value={config.module}
                                    onChange={(e) => setConfig({ ...config, module: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                >
                                    {modules.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Question Quantity</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[25, 50, 75, 100].map(pct => (
                                        <button
                                            key={pct}
                                            onClick={() => setConfig({ ...config, questionCount: pct })}
                                            className={`py-2 rounded-lg border text-sm font-medium transition-colors ${config.questionCount === pct
                                                    ? 'bg-cyan-600 border-cyan-500 text-white'
                                                    : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                                                }`}
                                        >
                                            {pct}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleStartExam}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98] mt-4"
                    >
                        Start Exam
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'results') {
        const score = calculateScore();
        const percentage = Math.round((score / examQuestions.length) * 100);

        return (
            <div className="flex flex-col h-full">
                <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur pb-4 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={onBack} className="text-slate-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-white">Exam Results</h2>
                    </div>

                    <div className="bg-slate-800 rounded-2xl p-6 text-center border border-slate-700">
                        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Your Score</div>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            {score} / {examQuestions.length}
                        </div>
                        <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${percentage >= 75 ? 'bg-green-500/20 text-green-400' :
                                percentage >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>
                            {percentage}% Accuracy
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pb-8">
                    <h3 className="text-lg font-semibold text-slate-300 px-1">Review Answers</h3>
                    {examQuestions.map((q, idx) => {
                        const userAnswer = userAnswers[q.id];
                        const isCorrect = userAnswer === q.answer;

                        return (
                            <div key={q.id} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-slate-800/50 border-slate-700' : 'bg-red-900/10 border-red-900/30'
                                }`}>
                                <div className="flex gap-3 mb-3">
                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <p className="font-medium text-slate-200">{q.question}</p>
                                </div>

                                <div className="space-y-2 pl-9">
                                    <div className="text-sm">
                                        <span className="text-slate-500">Your Answer: </span>
                                        <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                            {userAnswer || 'Skipped'}
                                        </span>
                                    </div>
                                    {!isCorrect && (
                                        <div className="text-sm">
                                            <span className="text-slate-500">Correct Answer: </span>
                                            <span className="text-green-400">{q.answer}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Active Phase
    const currentQ = examQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={18} />
                    <span className="text-sm font-mono">Test Mode</span>
                </div>
                <div className="text-sm font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    {currentQuestionIndex + 1} / {examQuestions.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <div className="flex-1 overflow-y-auto pb-20">
                <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg">
                    <div className="mb-6">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                            {currentQ.module}
                        </span>
                        <h3 className="text-xl font-medium text-white mt-2 leading-relaxed">
                            {currentQ.question}
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {currentQ.options.map((opt, idx) => {
                            const isSelected = userAnswers[currentQ.id] === opt;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(opt)}
                                    className={`w-full p-4 rounded-xl text-left border transition-all duration-200 flex items-center gap-3 group ${isSelected
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                                            : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-white bg-white/20' : 'border-slate-500 group-hover:border-slate-400'
                                        }`}>
                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                    </div>
                                    <span className="text-base">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-800">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="p-3 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={() => setPhase('results')}
                            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all"
                        >
                            Submit Exam
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(Math.min(examQuestions.length - 1, currentQuestionIndex + 1))}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
                        >
                            Next <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestMode;
