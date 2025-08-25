
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ProjectsDashboard from './pages/ProjectsDashboard';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ProjectsDashboard />} />
        <Route path="/editor/:projectId" element={<EditorPage />} />
        <Route path="/preview/:projectId/:pageId" element={<PreviewPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;