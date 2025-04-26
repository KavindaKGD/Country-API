import { useEffect, useState } from "react";
import { fetchAllCountries } from "../services/CountryService";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const data = await fetchAllCountries();
    setCountries(data);
  };

  const favCountries = countries.filter((country) => favorites.includes(country.cca3));

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">⭐ Favorite Countries</h1>
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
        >
          ← Back to Home
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favCountries.length > 0 ? (
          favCountries.map((country, index) => (
            <div
              key={index}
              onClick={() => navigate(`/country/${country.cca3}`)}
              className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden p-4 hover:shadow-lg transition"
            >
              <img
                src={country.flags?.svg}
                alt={`${country.name.common} flag`}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="text-lg font-bold text-blue-800 mt-3">
                {country.name.common}
              </h2>
              <p className="text-sm text-gray-700">Capital: {country.capital?.[0]}</p>
              <p className="text-sm text-gray-700">Region: {country.region}</p>
              <p className="text-sm text-gray-700">Population: {country.population.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-600">
            No favorites added yet.
          </div>
        )}
      </div>
    </div>
  );
}
