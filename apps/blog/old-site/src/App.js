import './App.css';
import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import ArticlePage from './pages/Article';
import HomePage from './pages/Home';
import TopicPage from './pages/Topic';
import OverviewPage from './pages/Overview';
import { NotFound } from './components/Errors';
import MobilePage from './pages/Mobile';

function App() {
  const [isMobile, setIsMobile] = useState(false)
 
  //choose the screen size 
  const handleResize = () => {
    if (window.innerWidth < 760) {
        setIsMobile(true)
    } else {
        setIsMobile(false)
    }
  }

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })

  if (isMobile) {
    return <MobilePage />
  }



  return (
    <Router>
      <Routes>
        <Route path="/topics" element={<OverviewPage />} com />
        <Route path="/:topic/:article" element={<ArticlePage />} />
        <Route path="/:topic" element={<TopicPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />      
      </Routes>
    </Router>
  );
}

export default App;
