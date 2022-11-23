import Header from "../components/header";
// import Data from "../assets/responseex.json";
import Rating from "@mui/material/Rating";
import RETTYFAM1 from "../assets/images/familiar1.png";
import RETTYFAM2 from "../assets/images/familiar2.png";
import RETTYFAM3 from "../assets/images/familiar3.png";
import TABELOG from "../assets/images/tabelogicon.png";
import GMAP from "../assets/images/Gicon.png";
import SUN from "../assets/images/sun.png";
import MOON from "../assets/images/moon.png";

import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Shop {
	shop_name: string;
	shop_url: string;
	rating: number;
	dinner_price: string;
	lunch_price: string;
	main_image: string;
	google_map_rating: number;
	retty_familiar_genre: string;
	retty_familiar_stars: number;
}

const ShopList = () => {
	const retty_fam = [RETTYFAM1, RETTYFAM2, RETTYFAM3];
	const [data, setData] = useState([]);
	const location = useLocation();
	const query = location.state as { areaQuery: string; keywordQuery: string };

	useEffect(() => {
		const url = "https://aqitfx3dx7roepjj3ebv2cgwte0mjzbj.lambda-url.ap-northeast-1.on.aws/";

		axios({
			method: "get",
			url: url,
			responseType: "stream",
			params: {
				area_query: query.areaQuery,
				keyword_query: query.keywordQuery,
			},
		}).then((response) => {
			console.log(response);
			console.log(response.data);
			setData(JSON.parse(response.data));
		});
	});

	return (
		<>
			<Header />
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-4">
				{data.map((shop: Shop) => {
					const average_rating = ((shop.rating + shop.google_map_rating) / 2).toFixed(1);
					return (
						<a
							href={shop.shop_url}
							// className="flex flex-col items-center ml-10 mb-3 bg-white border rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
							className=" bg-white border rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
						>
							<div className="flex">
								<img
									className="object-contain w-1/2 rounded md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
									src={shop.main_image}
								/>
								<img
									className="object-contain w-1/2 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
									src={shop.main_image}
								/>
							</div>

							<div className="flex flex-col justify-between p-4 leading-normal">
								<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
									{shop.shop_name}
								</h5>

								<div className="flex items-center">
									<Rating name="simple-controlled" value={parseFloat(average_rating)} />
									<p className="ml-1 font-bold text-xl text-gray-700 dark:text-gray-400">{average_rating}</p>
									<img src={TABELOG} className="ml-8 w-5 object-contain" />
									<p className="ml-2 font-bold text-gray-700 dark:text-gray-400">{shop.rating}</p>
									<img src={GMAP} className="ml-2 w-5 object-contain" />
									<p className="ml-1 font-bold text-gray-700 dark:text-gray-400">{shop.google_map_rating}</p>
								</div>

								<div className="flex mt-1">
									<img src={SUN} className="w-5 object-contain" />
									<p className="ml-1 font-normal text-gray-700 dark:text-gray-400">{shop.lunch_price}</p>
									<img src={MOON} className="ml-2 w-5 object-contain" />
									<p className="ml-1 font-normal text-gray-700 dark:text-gray-400">{shop.dinner_price}</p>
								</div>
								{shop.retty_familiar_genre && (
									<>
										<img src={retty_fam[shop.retty_familiar_stars - 1]} className="mt-2 object-contain w-1/5" />
									</>
								)}
							</div>
						</a>
					);
				})}
			</div>
		</>
	);
};

export default ShopList;
