import { useNavigate } from 'react-router-dom';
import BoardSelector from '@/components/BoardSelector';

export default function BoardSelection() {
  const navigate = useNavigate();

  const handleBoardsSelected = (boardNumbers: number[]) => {
    // Store selected boards in sessionStorage and navigate to game
    sessionStorage.setItem('selectedBoards', JSON.stringify(boardNumbers));
    navigate('/game');
  };

  return <BoardSelector onBoardsSelected={handleBoardsSelected} />;
}
