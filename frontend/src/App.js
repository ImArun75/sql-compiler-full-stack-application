import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorkspaceProvider } from './context/WorkspaceContext';
import AssignmentsPage from './components/AssignmentsPage/AssignmentsPage';
import AttemptPage from './components/AttemptPage/AttemptPage';
import './styles/main.scss';

export default function App() {
  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <div className="app">
          <header className="app__header">
            <h1>CipherSQLStudio</h1>
          </header>
          <main className="app__main">
            <Routes>
              <Route path="/" element={<AssignmentsPage />} />
              <Route path="/attempt/:id" element={<AttemptPage />} />
            </Routes>
          </main>
        </div>
      </WorkspaceProvider>
    </BrowserRouter>
  );
}
