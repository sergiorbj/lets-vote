import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { VotePage } from './pages/VotePage';
import { RankingPage } from './pages/RankingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/vote" element={<VotePage />} />
      <Route path="/ranking" element={<RankingPage />} />
    </Routes>
  );
}

export default App;
