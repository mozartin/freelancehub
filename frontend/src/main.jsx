import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import JobList from './components/JobList';
import PageContainer from './components/layout/PageContainer';
import JobsPage from './pages/JobsPage';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <JobList /> */}
    <JobsPage />
  </StrictMode>
);
