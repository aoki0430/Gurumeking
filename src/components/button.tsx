import { MouseEventHandler } from "react";

function Button(props: { text: string; onClick: MouseEventHandler }) {
	return (
		<div className="inline-flex flex-col items-center justify-center px-16 py-6 bg-red-400 shadow rounded-lg">
			<button onClick={props.onClick} className="text-4xl text-white font-Shirokuma">
				{props.text}
			</button>
		</div>
	);
}
export default Button;
