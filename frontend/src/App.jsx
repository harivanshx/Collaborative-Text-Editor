import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Editor from './Editor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs/:id" element={<Editor />} />  
      </Routes>
    </Router>
  );
}

export default App;
