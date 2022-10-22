function ToggleView () {
return <>
    <div className="inline-flex space-x-2.5 items-center justify-start">
    <p className="text-2xl">リストで見る</p>
    <div className="flex space-x-2.5 items-center justify-start">
        <div className="transform -rotate-90 opacity-80 w-8 h-0.5 border-gray-400"/>
        <p className="transform -rotate-1 text-2xl text-gray-400">地図で見る</p>
    </div>
</div>
</>   
}

export default ToggleView