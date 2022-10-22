
function Button(props:{text: string}) {
    return (
    <div className="inline-flex flex-col items-center justify-center px-16 py-6 bg-red-400 shadow rounded-lg">
        <p className="text-4xl text-white font-Shirokuma">{props.text}</p>
    </div>
    );
}
export default Button;