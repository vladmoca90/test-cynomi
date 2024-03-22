import { Route, Routes } from "react-router-dom";
import CountryDetailsComponent from "./CountryDetailsComponent";
import CountriesListComponent from "./CountriesListComponent";

export default function App() {    
    return (
        <div id="App">
            <Routes>
                <Route path="/" element={<CountriesListComponent />} />
                <Route path="/country-details/:cca3" element={<CountryDetailsComponent />} />
            </Routes>
        </div>
    );
}