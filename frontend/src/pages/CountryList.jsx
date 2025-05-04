import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchAllCountries,
  searchCountriesByName,
  filterCountriesByRegion,
} from "../services/CountryService";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CountryList() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem("favorites");
    return favs ? JSON.parse(favs) : [];
  });
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Initial data load
  useEffect(() => {
    fetchCountries();
  }, []);

  // Autofocus search input on page load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  // Handle clicks outside suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Apply sorting and filtering when dependencies change
  useEffect(() => {
    if (allCountries.length > 0) {
      let result = [...countries];
      
      // Sort the countries
      result = sortCountries(result, sortBy, sortOrder);
      
      setFilteredCountries(result);
    }
  }, [countries, sortBy, sortOrder]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllCountries();
      
      if (!data || data.length === 0) {
        throw new Error("Failed to fetch countries");
      }
      
      const sortedData = sortCountries(data, sortBy, sortOrder);
      setAllCountries(data);
      setCountries(data);
      setFilteredCountries(sortedData);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to load countries. Please try again.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const sortCountries = (data, sortKey, order) => {
    return [...data].sort((a, b) => {
      let valueA, valueB;
      
      switch(sortKey) {
        case 'name':
          valueA = a.name.common.toLowerCase();
          valueB = b.name.common.toLowerCase();
          break;
        case 'population':
          valueA = a.population;
          valueB = b.population;
          break;
        case 'area':
          valueA = a.area || 0;
          valueB = b.area || 0;
          break;
        default:
          valueA = a.name.common.toLowerCase();
          valueB = b.name.common.toLowerCase();
      }
      
      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (search.trim() === "") {
      setCountries(allCountries);
      return;
    }
    
    setLoading(true);
    try {
      const data = await searchCountriesByName(search);
      setCountries(data || []);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setSelectedSuggestionIndex(-1);

    if (value.trim() !== "") {
      const filteredSuggestions = allCountries
        .filter(country =>
          country.name.common.toLowerCase().includes(value.toLowerCase()) ||
          (country.capital && country.capital[0]?.toLowerCase().includes(value.toLowerCase())) ||
          country.cca3.toLowerCase() === value.toLowerCase()
        )
        .slice(0, 6);
      
      setSuggestions(filteredSuggestions.map(country => ({ 
        name: country.name.common, 
        capital: country.capital?.[0] || 'N/A',
        code: country.cca3,
        flag: country.flags?.svg || country.flags?.png
      })));
      
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = useCallback((suggestion) => {
    setSearch(suggestion.name);
    setShowSuggestions(false);
    navigate(`/country/${suggestion.code}`);
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    // Handle keyboard navigation through suggestions
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prevIndex => 
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : 0
        );
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          selectSuggestion(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleRegionFilter = async (e) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    
    setLoading(true);
    try {
      if (selectedRegion === "") {
        setCountries(allCountries);
      } else {
        const data = await filterCountriesByRegion(selectedRegion);
        setCountries(data || []);
      }
    } catch (err) {
      setError("Failed to filter by region. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setRegion("");
    setCountries(allCountries);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Default to ascending order when changing fields
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleFavorite = (countryCode, e) => {
    e.stopPropagation();
    
    let updatedFavorites = [];
    if (favorites.includes(countryCode)) {
      updatedFavorites = favorites.filter(code => code !== countryCode);
    } else {
      updatedFavorites = [...favorites, countryCode];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="relative flex-grow">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for a country, capital, or code..."
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(search.trim() !== "")}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
                aria-label="Search countries"
                aria-autocomplete="list"
                aria-controls={showSuggestions ? "search-suggestions" : undefined}
                aria-activedescendant={selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined}
                role="combobox"
                aria-expanded={showSuggestions}
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
              
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  id="search-suggestions"
                  className="absolute z-10 bg-white w-full mt-1 border rounded-lg shadow-lg max-h-80 overflow-y-auto animate-fadeIn"
                  role="listbox"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      id={`suggestion-${index}`}
                      onClick={() => selectSuggestion(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      className={`p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex items-center ${
                        selectedSuggestionIndex === index ? 'bg-blue-50' : ''
                      }`}
                      role="option"
                      aria-selected={selectedSuggestionIndex === index}
                      tabIndex="-1"
                    >
                      {suggestion.flag && (
                        <img 
                          src={suggestion.flag} 
                          alt={`${suggestion.name} flag`}
                          className="h-6 w-10 mr-3 object-cover rounded-sm shadow-sm" 
                          loading="lazy"
                        />
                      )}
                      <div>
                        <div className="font-medium">{suggestion.name}</div>
                        {suggestion.capital !== 'N/A' && (
                          <div className="text-xs text-gray-500">Capital: {suggestion.capital}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              <div className="relative w-full xs:w-auto flex-grow sm:max-w-[200px] group">
                <label htmlFor="region-filter" className="sr-only">Filter by Region</label>
                <select
                  id="region-filter"
                  value={region}
                  onChange={handleRegionFilter}
                  className="w-full appearance-none bg-white border border-gray-200 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all group-hover:border-gray-300"
                  aria-label="Filter by region"
                >
                  <option value="">All Regions</option>
                  <option value="Africa">Africa</option>
                  <option value="Americas">Americas</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Oceania">Oceania</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative w-full xs:w-auto flex-grow sm:max-w-[200px] group">
                <label htmlFor="sort-by" className="sr-only">Sort by</label>
                <select
                  id="sort-by"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="w-full appearance-none bg-white border border-gray-200 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all group-hover:border-gray-300"
                  aria-label="Sort countries"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="population-desc">Population (High-Low)</option>
                  <option value="population-asc">Population (Low-High)</option>
                  <option value="area-desc">Area (Large-Small)</option>
                  <option value="area-asc">Area (Small-Large)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {(search || region) && (
                <button 
                  onClick={resetFilters}
                  className="py-2.5 px-4 border border-gray-300 text-blue-700 bg-white rounded-lg hover:bg-gray-50 transition-colors hover:border-gray-400 flex items-center gap-1"
                  aria-label="Reset filters"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 transition-colors p-1" aria-label="Dismiss error message">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Results count and Favorites button */}
        <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
          {!initialLoading && (
            <div className="text-sm text-gray-600">
              {filteredCountries.length > 0 
                ? `Showing ${filteredCountries.length} ${filteredCountries.length === 1 ? 'country' : 'countries'}`
                : (loading ? '' : 'No countries found')
              }
            </div>
          )}
          
          <div className="flex gap-2 items-center">
            <Link 
              to="/favorites" 
              className="flex items-center gap-1.5 text-sm px-4 py-2 bg-white border border-yellow-400 text-yellow-600 rounded-md shadow-sm hover:bg-yellow-50 transition-colors hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-label="View favorite countries"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
              </svg>
              Favorites ({favorites.length})
            </Link>
          </div>
        </div>

        {/* Main content area */}
        {initialLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading countries..." />
          </div>
        ) : (
          <div className="relative">
            {/* Loading overlay */}
            {loading && !initialLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                <LoadingSpinner size="lg" />
              </div>
            )}
            
            {filteredCountries.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredCountries.map((country) => (
                  <div
                    key={country.cca3}
                    className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-400 group"
                  >
                    <button
                      onClick={(e) => toggleFavorite(country.cca3, e)}
                      className="absolute top-2 right-2 z-10 bg-white bg-opacity-75 p-1.5 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-sm"
                      aria-label={favorites.includes(country.cca3) ? `Remove ${country.name.common} from favorites` : `Add ${country.name.common} to favorites`}
                    >
                      {favorites.includes(country.cca3) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </button>
                    
                    <a
                      href={`/country/${country.cca3}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/country/${country.cca3}`);
                      }}
                      className="block p-3 sm:p-4 h-full focus:outline-none"
                      aria-label={`View details for ${country.name.common}`}
                    >
                      <div className="aspect-video overflow-hidden rounded-lg shadow-sm bg-gray-100">
                        <img
                          src={country.flags?.svg || country.flags?.png}
                          alt={`${country.name.common} flag`}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x150?text=No+Flag+Available';
                          }}
                        />
                      </div>
                      
                      <h2 className="text-lg font-bold text-blue-800 mt-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {country.name.common}
                      </h2>
                      
                      <div className="mt-2 space-y-1.5">
                        {country.capital && country.capital[0] && (
                          <p className="text-sm text-gray-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="truncate">{country.capital[0]}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-700 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{country.region}</span>
                        </p>
                        <p className="text-sm text-gray-700 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{country.population.toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="text-sm text-blue-600 group-hover:text-blue-800 transition-colors inline-flex items-center">
                          View details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center animate-fadeIn">
                  <div className="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">No countries found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                    <button 
                      onClick={resetFilters} 
                      className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
