import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JobsPage from './pages/JobsPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import JobDetailsPage from './pages/JobDetailsPage';
import HomePage from './pages/HomePage';
import CreateJobPage from './pages/CreateJobPage';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/jobs/new" element={<CreateJobPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
