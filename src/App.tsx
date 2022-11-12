import TopPage from "./pages/toppage";
import { RecoilRoot } from "recoil";

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
