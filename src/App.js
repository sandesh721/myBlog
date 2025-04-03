import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Article from './pages/article';
import Publish from './pages/publish';
import ReadArticle from './pages/readArticle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/article' element={<Article />} />
        <Route path='/publish' element={<Publish />} />
        <Route path='/read/:id' element={<ReadArticle />} />
      </Routes>
    </Router>
  );
}

export default App;
