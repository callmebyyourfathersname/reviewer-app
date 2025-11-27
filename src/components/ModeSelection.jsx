import React from 'react';
import { BookOpen, PenTool } from 'lucide-react';

const ModeSelection = ({ onSelectMode }) => {
    return (
        <div className="flex flex-col gap-6 my-auto">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
                <p className="text-slate-400">Choose a mode to start studying.</p>
            </div>

            <div className="grid gap-4">
                <button
                    onClick={() => onSelectMode('review')}
                    className="group relative overflow-hidden p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 text-left"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-100">Review Mode</h3>
                            <p className="text-sm text-slate-400">Browse questions with answers</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => onSelectMode('test')}
                    className="group relative overflow-hidden p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 text-left"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                            <PenTool size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-100">Test Mode</h3>
                            <p className="text-sm text-slate-400">Take an exam with scoring</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ModeSelection;
