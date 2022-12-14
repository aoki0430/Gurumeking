function SearchInput(props: { text: string; image: string; name: string }) {
	return (
		<div className="inline-flex flex-col items-start justify-start py-1 pr-32 bg-white shadow border-2 rounded-lg border-gray-300">
			<div className="inline-flex items-center justify-start px-4">
				{/* <input name={props.name}> */}
				<img src={props.image} />
				<div className="flex items-start justify-center p-3">
					<p className="text-3xl text-gray-400 font-Shirokuma">{props.text}</p>
				</div>
				{/* </input> */}
			</div>
		</div>
	);
}

export default SearchInput;
