import NavBar from "../components/navbar";
import "../css/quote.css"
function Quote() {
    return(
        <div className="quoteContainer">
            <NavBar />
            <div>

            <h1>Quotes</h1>
            <p>No Quotes added yet...</p>
            </div>
        </div>
    );
}
export default Quote;