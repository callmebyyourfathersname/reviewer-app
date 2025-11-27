import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
            <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-900 shadow-2xl shadow-black border-x border-slate-800">
                <header className="p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-10">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Web System Reviewer
                    </h1>
                </header>
                <main className="flex-1 p-4 flex flex-col">
                    {children}
                </main>
                <footer className="p-4 text-center text-slate-500 text-xs border-t border-slate-800">
                    © 2025 Reviewer App
                </footer>
            </div>
        </div>
    );
};

export default Layout;
