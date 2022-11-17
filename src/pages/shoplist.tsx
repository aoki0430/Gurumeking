import Header from "../components/header";
import Data from "../assets/responseex.json";

const ShopList = () => {
	return (
		<>
			<Header />

			<div className="flex-col">
				{Data.res.map((shop) => {
					return (
						<a
							href={shop.shop_url}
							className="flex flex-col items-center ml-10 mb-3 bg-white border rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
						>
							<img
								className="object-cover w-full h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
								src={shop.main_image}
								alt=""
							/>
							<div className="flex flex-col justify-between p-4 leading-normal">
								<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
									{shop.shop_name}
								</h5>

								<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">食べログ：{shop.rating}</p>
								<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">GMap：{shop.google_map_rating}</p>
								{shop.retty_familiar_genre && (
									<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
										Retty人気店：
										{shop.retty_familiar_genre}&emsp;{shop.retty_familiar_stars}
									</p>
								)}

								<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">お昼：{shop.lunch_price}</p>
								<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">夜：{shop.dinner_price}</p>
							</div>
						</a>
					);
				})}
			</div>
		</>
	);
};

export default ShopList;
