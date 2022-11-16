import Header from "../components/header";
import Button from "../components/button";
import PINN from "../assets/images/pinn.png";
import RESTAURANT from "../assets/images/restaurant.png";
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
	const onClickSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
		navigate("/shoplist");
	};

	return (
		<>
			<Header />
			<div className="flex items-start justify-start">
				<form>
					<div className="w-1/3 inline-flex flex-col items-start justify-start py-1 ml-10 bg-white shadow border-2 rounded-lg border-gray-300">
						<div className="inline-flex items-center justify-start">
							<img src={PINN} className="ml-4" />
							<input
								type="text"
								id="areaQuery"
								onInput={onInputArea}
								className="font-Shirokuma text-gray-700 text-3xl rounded-lg  block ml-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
								placeholder="場所"
							></input>
						</div>
					</div>
					<div className="w-1/2 inline-flex flex-col items-start justify-start py-1 ml-2 bg-white shadow border-2 rounded-lg border-gray-300">
						<div className="inline-flex items-center justify-start">
							<img src={RESTAURANT} className="ml-4" />
							<input
								type="text"
								id="areaQuery"
								onInput={onInputKeyword}
								className="font-Shirokuma text-gray-700 text-3xl rounded-lg  block ml-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
								placeholder="ジャンル・店名"
							></input>
						</div>
					</div>
				</form>
			</div>
			<div className="mx-10 mt-5">
				<Button text="ぼなぺてぃくん、お店を探してきて！" onClick={() => navigate("shoplist")} />
			</div>
		</>
	);
};

export default TopPage;
