import "./1Medicure.css";
import MedicureData from "./2MedicureData";
import MedDoct from "./3MedDoct";

function Medicure({
    search = "",
    filter = {},
    setCartCount,
    onOpenDetails,
    onBuyNow
}) {
    return (
        <div className="medicure-page">
            <MedicureData
                search={search}
                filter={filter}
                setCartCount={setCartCount}
                onOpenDetails={onOpenDetails}
                onBuyNow={onBuyNow}
            />
            <MedDoct />
        </div>
    );
}

export default Medicure;