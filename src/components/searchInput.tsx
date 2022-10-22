function SearchInput(props: { text: string; image: string }) {
	return (
		<div className="inline-flex flex-col items-start justify-start py-1 pr-32 bg-white shadow border-2 rounded-lg border-gray-300">
			<div className="inline-flex items-center justify-start px-4">
				<img className="w-1/6 h-12" src={props.image} />
				<div className="flex items-start justify-center p-3">
					<p className="transform -rotate-1 text-3xl text-gray-400">{props.text}</p>
				</div>
			</div>
		</div>
	);
}

export default SearchInput;
