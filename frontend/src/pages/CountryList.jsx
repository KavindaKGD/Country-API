import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllCountries,
  searchCountriesByName,
  filterCountriesByRegion,
} from "../services/CountryService";

export default function CountryList() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem("favorites");
    return favs ? JSON.parse(favs) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const data = await fetchAllCountries();
    setCountries(data);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.trim() === "") return fetchCountries();
    const data = await searchCountriesByName(search);
    setCountries(data);
  };

  const handleRegionFilter = async (e) => {
    const region = e.target.value;
    setRegion(region);
    if (region === "") return fetchCountries();
    const data = await filterCountriesByRegion(region);
    setCountries(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleFavorite = (countryCode) => {
    let updatedFavorites = [];
    if (favorites.includes(countryCode)) {
      updatedFavorites = favorites.filter((code) => code !== countryCode);
    } else {
      updatedFavorites = [...favorites, countryCode];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">🌍 Country Explorer</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/favorites")}
            className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
          >
            Favorites ⭐
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by country name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-md border w-64"
          />
          <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800">
            Search
          </button>
        </form>

        <select
          value={region}
          onChange={handleRegionFilter}
          className="p-2 rounded-md border w-64"
        >
          <option value="">Filter by Region</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {countries.map((country, index) => (
          <div
            key={index}
            className="relative bg-white rounded-xl shadow-md overflow-hidden p-4 hover:shadow-lg transition"
          >
            <button
              onClick={() => toggleFavorite(country.cca3)}
              className="absolute top-2 right-2 text-2xl"
            >
              {favorites.includes(country.cca3) ? "⭐" : "☆"}
            </button>
            <div
              onClick={() => navigate(`/country/${country.cca3}`)}
              className="cursor-pointer"
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
          </div>
        ))}
      </div>
    </div>
  );
}
