import TopPage from "./pages/toppage";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShopList from "./pages/shoplist";

function App() {
	return (
		<Router>
			<RecoilRoot>
				<Routes>
					<Route index element={<TopPage />} />
					<Route path="shoplist" element={<ShopList />} />
				</Routes>
			</RecoilRoot>
		</Router>
	);
}

export default App;
