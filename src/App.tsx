import TopPage from './pages/toppage';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <TopPage />
      </div>
    </RecoilRoot>
  );
}

export default App;
