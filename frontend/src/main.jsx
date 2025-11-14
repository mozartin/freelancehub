import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JobList from './JobList.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <JobList />
  </StrictMode>
);
