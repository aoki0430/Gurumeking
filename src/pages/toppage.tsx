import Header from "../components/header";
import Button from "../components/button";
import SearchInput  from "../components/searchInput";
import PINN from "../assets/images/pinn.png"
import RESTAURANT from "../assets/images/restaurant.png"

function TopPage() {
    return(
        <>
    <Header/>
    <div className="inline-flex space-x-5 items-start justify-start">
    <SearchInput text="場所" image={PINN}/>
    <SearchInput text="ジャンル・店名" image={RESTAURANT}/>
    </div>
    <div className="ml-72">
    <Button text="ぼなぺてぃくん、お店を探してきて！"/>
    </div>
    </>
    )
}

export default TopPage