import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import JobList from './components/JobList';
import PageContainer from './components/layout/PageContainer';
import JobsPage from './pages/JobsPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import JobDetailsPage from './pages/JobDetailsPage';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<JobsPage />} />
        <Route path='/jobs' element={<JobsPage />} />
        <Route path='/jobs/:id' element={ <JobDetailsPage/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
