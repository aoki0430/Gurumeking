import Header from "../components/header";
import PINN from "../assets/images/pinn.png";
import RESTAURANT from "../assets/images/restaurant.png";
import SHIROKUMA from "../assets/images/shirokuma.png";
import React from "react";
const { useState } = React;
import { useNavigate } from "react-router-dom";

const TopPage = () => {
	const [areaQuery, setAreaQuery] = useState("");
	const [keywordQuery, setKeywordQuery] = useState("");
	const navigate = useNavigate();

	const onInputArea = (event: React.FormEvent<HTMLInputElement>) => {
		setAreaQuery(event.currentTarget.value);
	};
	const onInputKeyword = (event: React.FormEvent<HTMLInputElement>) => {
		setKeywordQuery(event.currentTarget.value);
	};
	const onClickSearch = () => {
		navigate("/shoplist", {
			state: {
				areaQuery: areaQuery,
				keywordQuery: keywordQuery,
			},
		});
	};

	return (
		<>
			<Header></Header>
			<main className="container mx-auto">
				<form className="flex flex-col items-center space-y-2">
					<div className="w-2/3 flex justify-center">
						<img src={SHIROKUMA} className="w-3/2 object-contain mb-10" />
					</div>
					<div className="w-3/4 bg-white shadow border-2 rounded-lg border-gray-300">
						<div className="inline-flex items-center justify-start">
							<img src={PINN} className="ml-4" />
							<input
								type="text"
								id="areaQuery"
								onInput={onInputArea}
								className="font-Shirokuma text-gray-700 text-2xl rounded-lg  block ml-4 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
								placeholder="ばしょ"
							></input>
						</div>
					</div>
					<div className=" w-3/4 bg-white shadow border-2 rounded-lg border-gray-300">
						<div className="inline-flex items-center justify-start">
							<img src={RESTAURANT} className="ml-4" />
							<input
								type="text"
								id="areaQuery"
								onInput={onInputKeyword}
								className="font-Shirokuma text-gray-700 text-2xl rounded-lg  block ml-4 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
								placeholder="じゃんる・おみせ"
							></input>
						</div>
					</div>
					<div className="w-3/4 hover:opacity-80 py-4 flex justify-center bg-red-400 shadow rounded-lg">
						<button onClick={onClickSearch} className="text-2xl text-white font-Shirokuma">
							ぼなぺてぃくん
							<br />
							おみせをさがして！
						</button>
					</div>
				</form>
			</main>
		</>
	);
};

export default TopPage;
