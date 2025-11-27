import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import questionsData from '../data/questions.json';

const ReviewMode = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState('All');

    const modules = useMemo(() => {
        const mods = new Set(questionsData.map(q => q.module));
        return ['All', ...Array.from(mods).sort()];
    }, []);

    const filteredQuestions = useMemo(() => {
        return questionsData.filter(q => {
            const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.id.includes(searchTerm);
            const matchesModule = selectedModule === 'All' || q.module === selectedModule;
            return matchesSearch && matchesModule;
        });
    }, [searchTerm, selectedModule]);

    return (
        <div className="flex flex-col h-full">
            {/* Header & Controls */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur pb-4 space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-white">Review Mode</h2>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                            <Filter size={18} />
                        </div>
                        <select
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            className="appearance-none bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-8 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors h-full"
                        >
                            {modules.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="text-sm text-slate-500 px-1">
                    Showing {filteredQuestions.length} questions
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4 pb-4">
                {filteredQuestions.map((q) => (
                    <div key={q.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-700 text-slate-300">
                                {q.module}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">#{q.id}</span>
                        </div>

                        <p className="font-medium text-lg text-slate-100 leading-relaxed">
                            {q.question}
                        </p>

                        <div className="space-y-2">
                            {q.options.map((opt, idx) => {
                                const isCorrect = opt === q.answer;
                                return (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-xl text-sm border transition-colors ${isCorrect
                                                ? 'bg-green-500/10 border-green-500/50 text-green-200'
                                                : 'bg-slate-900/50 border-slate-800 text-slate-400'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isCorrect ? 'border-green-500 bg-green-500' : 'border-slate-600'
                                                }`}>
                                                {isCorrect && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <span>{opt}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {filteredQuestions.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        No questions found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewMode;
