import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Article from './pages/article';
import Publish from './pages/publish';
import ReadArticle from './pages/readArticle';
import Quote from './pages/quote';
import Register from './pages/register';
import Login from './pages/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/article' element={<Article />} />
        <Route path='/publish' element={<Publish />} />
        <Route path='/quote' element={<Quote />} />
        <Route path='/read/:id' element={<ReadArticle />} />
      </Routes>
    </Router>
  );
}

export default App;
