import { useEffect, useState } from "react";
import { fetchAllCountries } from "../services/CountryService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Favorites() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(favs);
      fetchCountries();
    } catch (err) {
      setError("Failed to load favorites. Please try again.");
    }
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllCountries();
      setCountries(data);
    } catch (err) {
      setError("Failed to load countries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (countryCode, e) => {
    e.stopPropagation();
    const updatedFavorites = favorites.filter(code => code !== countryCode);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Filter countries by favorites first, then apply search and region filters
  const filteredCountries = countries
    .filter(country => favorites.includes(country.cca3))
    .filter(country => {
      // Filter by search query
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        country.name.common.toLowerCase().includes(query) ||
        country.name.official.toLowerCase().includes(query) ||
        (country.capital && country.capital[0]?.toLowerCase().includes(query)) ||
        country.region.toLowerCase().includes(query) ||
        country.subregion?.toLowerCase().includes(query) ||
        country.cca3.toLowerCase().includes(query)
      );
    })
    .filter(country => {
      // Filter by selected region
      return !selectedRegion || country.region === selectedRegion;
    });

  // Extract unique regions from favorite countries
  const availableRegions = [...new Set(
    countries
      .filter(country => favorites.includes(country.cca3))
      .map(country => country.region)
  )].sort();
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 flex items-center">
            <span className="mr-2">⭐</span>
            <span>Favorite Countries</span>
            {favorites.length > 0 && (
              <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                {favorites.length}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">Your saved collection of countries</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900" aria-label="Dismiss error message">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Search favorites"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {availableRegions.length > 0 && (
              <div className="relative sm:w-48">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Filter by region"
                >
                  <option value="">All Regions</option>
                  {availableRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active filters */}
        {(searchQuery || selectedRegion) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchQuery && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                <span>Search: {searchQuery}</span>
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            {selectedRegion && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                <span>Region: {selectedRegion}</span>
                <button 
                  onClick={() => setSelectedRegion("")} 
                  className="ml-2 text-green-600 hover:text-green-800"
                  aria-label="Clear region filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            <button 
              onClick={clearFilters}
              className="bg-white text-gray-600 px-3 py-1 rounded-full text-sm border border-gray-300 flex items-center hover:bg-gray-50"
            >
              Clear all filters
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Loading your favorites..." />
          </div>
        ) : (
          <>
            {favorites.length > 0 ? (
              <>
                {filteredCountries.length > 0 ? (
                  <>
                    {/* Results count */}
                    <div className="text-sm text-gray-600 mb-4">
                      Showing {filteredCountries.length} of {favorites.length} saved {favorites.length === 1 ? 'country' : 'countries'}
                      {(searchQuery || selectedRegion) ? ' based on your filters' : ''}
                    </div>
                    
                    {/* Country cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {filteredCountries.map((country, index) => (
                        <div
                          key={country.cca3 || index}
                          className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 duration-200"
                        >
                          <button
                            onClick={(e) => handleRemoveFavorite(country.cca3, e)}
                            className="absolute top-2 right-2 z-10 bg-white bg-opacity-75 p-1.5 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-sm"
                            aria-label="Remove from favorites"
                          >
                            <span className="text-xl" aria-hidden="true">⭐</span>
                          </button>
                          
                          <div
                            onClick={() => navigate(`/country/${country.cca3}`)}
                            className="cursor-pointer p-3 sm:p-4"
                          >
                            <div className="aspect-video overflow-hidden rounded-lg shadow-sm bg-gray-100">
                              <img
                                src={country.flags?.svg || country.flags?.png}
                                alt={`${country.name.common} flag`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/300x150?text=No+Flag+Available';
                                }}
                              />
                            </div>
                            <h2 className="text-lg font-bold text-blue-800 mt-3 line-clamp-1">
                              {country.name.common}
                            </h2>
                            <div className="mt-2 space-y-1.5">
                              {country.capital && country.capital[0] && (
                                <p className="text-sm text-gray-700 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  {country.capital[0]}
                                </p>
                              )}
                              <p className="text-sm text-gray-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {country.region}
                              </p>
                              <p className="text-sm text-gray-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {country.population.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <h3 className="text-xl font-medium mb-2">No countries match your search</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                      <button 
                        onClick={clearFilters} 
                        className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-gray-600">
                  <span className="block text-5xl mb-4">⭐</span>
                  <h3 className="text-xl font-medium mb-2">No favorites added yet</h3>
                  <p className="text-gray-500 mb-4">Start exploring countries and add them to your favorites!</p>
                  <button
                    onClick={() => navigate("/home")}
                    className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
                  >
                    Explore Countries
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
