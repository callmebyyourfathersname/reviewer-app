import React, { useState } from 'react';
import Layout from './components/Layout';
import ModeSelection from './components/ModeSelection';
import ReviewMode from './components/ReviewMode';
import TestMode from './components/TestMode';
import questionsData from './data/questions.json';

function App() {
  const [mode, setMode] = useState(null); // 'review' | 'test' | null

  const renderContent = () => {
    switch (mode) {
      case 'review':
        return <ReviewMode onBack={() => setMode(null)} />;
      case 'test':
        return <TestMode onBack={() => setMode(null)} />;
      default:
        return <ModeSelection onSelectMode={setMode} />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
}

export default App;
