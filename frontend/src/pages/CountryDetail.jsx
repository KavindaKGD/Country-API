import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CountryDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [borderCountries, setBorderCountries] = useState([]);

  useEffect(() => {
    fetchCountry();
    // Check if country is in favorites
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favs.includes(code));
  }, [code]);

  const fetchCountry = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
      if (res.data && res.data.length > 0) {
        setCountry(res.data[0]);
        
        // Fetch border countries if available
        if (res.data[0].borders && res.data[0].borders.length > 0) {
          const borderCodes = res.data[0].borders.join(',');
          const borderRes = await axios.get(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`);
          setBorderCountries(borderRes.data.map(c => ({ name: c.name.common, code: c.cca3 })));
        }
      } else {
        throw new Error("Country not found");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load country data");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavorites = [];
    
    if (isFavorite) {
      updatedFavorites = favs.filter(c => c !== code);
    } else {
      updatedFavorites = [...favs, code];
    }
    
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
          <LoadingSpinner size="lg" text="Loading country details..." />
        </div>
      </>
    );
  }

  if (error || !country) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-blue-50 p-4 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl text-red-600 font-semibold mb-2">Failed to load country data</h2>
            <p className="text-gray-600 mb-4">{error || "The country you're looking for might not exist or there was an error retrieving the data."}</p>
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors mr-2"
            >
              Return to Home
            </button>
            <button
              onClick={() => fetchCountry()}
              className="border border-blue-700 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // Format currency information
  const currencies = country.currencies 
    ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(", ")
    : 'N/A';

  // Format languages
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : 'N/A';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
        {/* Back button with hover effect */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-700 hover:text-blue-900 transition-colors group"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Flag section */}
            <div className="flex flex-col">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <img
                  src={country.flags?.svg || country.flags?.png}
                  alt={`${country.name.common} flag`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/640x360?text=No+Flag+Available';
                  }}
                />
              </div>

              {/* Additional country images if available */}
              {country.coatOfArms && (country.coatOfArms.svg || country.coatOfArms.png) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Coat of Arms</h3>
                  <div className="h-32 w-32 mx-auto bg-white rounded-lg p-2 border border-gray-200">
                    <img
                      src={country.coatOfArms.svg || country.coatOfArms.png}
                      alt={`${country.name.common} coat of arms`}
                      className="h-full w-auto mx-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Country details section */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
                  {country.name?.common}
                  <span className="text-sm ml-2 bg-gray-100 px-2 py-1 rounded text-gray-600 align-middle">{country.cca3}</span>
                </h1>
                
                <button
                  onClick={toggleFavorite}
                  className="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <span className="text-xl" aria-hidden="true">{isFavorite ? "⭐" : "☆"}</span>
                  <span className="text-sm">{isFavorite ? "Saved" : "Save"}</span>
                </button>
              </div>

              {country.name.official !== country.name.common && (
                <p className="text-gray-600 italic">
                  Official name: {country.name.official}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm sm:text-base">
                <div className="space-y-4">
                  <InfoItem 
                    icon={<BuildingIcon />}
                    label="Capital" 
                    value={country.capital?.[0] || 'N/A'} 
                  />
                  <InfoItem 
                    icon={<GlobeIcon />}
                    label="Region" 
                    value={`${country.region}${country.subregion ? ` (${country.subregion})` : ''}`} 
                  />
                  <InfoItem 
                    icon={<UsersIcon />}
                    label="Population" 
                    value={country.population.toLocaleString()} 
                  />
                  <InfoItem 
                    icon={<MapIcon />}
                    label="Area" 
                    value={`${country.area?.toLocaleString() || 'N/A'} km²`} 
                  />
                </div>
                
                <div className="space-y-4">
                  {country.languages && (
                    <InfoItem 
                      icon={<ChatIcon />}
                      label="Languages" 
                      value={languages} 
                    />
                  )}
                  {country.currencies && (
                    <InfoItem 
                      icon={<CurrencyIcon />}
                      label="Currencies" 
                      value={currencies} 
                    />
                  )}
                  {country.tld && country.tld.length > 0 && (
                    <InfoItem 
                      icon={<GlobeAltIcon />}
                      label="Domain" 
                      value={country.tld.join(', ')} 
                    />
                  )}
                  {country.car && country.car.side && (
                    <InfoItem 
                      icon={<TruckIcon />}
                      label="Drives on" 
                      value={country.car.side === 'left' ? 'Left side' : 'Right side'} 
                    />
                  )}
                </div>
              </div>

              {/* Maps button */}
              {country.maps && country.maps.googleMaps && (
                <div className="pt-2">
                  <a 
                    href={country.maps.googleMaps} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Border countries section */}
          {borderCountries.length > 0 && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Border Countries</h3>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map(border => (
                  <button
                    key={border.code}
                    onClick={() => navigate(`/country/${border.code}`)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors text-sm"
                  >
                    {border.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Information item component for consistent styling
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex">
      <div className="mr-2 text-gray-500 mt-0.5" aria-hidden="true">
        {icon}
      </div>
      <div>
        <dt className="font-medium text-gray-700">{label}</dt>
        <dd className="text-gray-600">{value}</dd>
      </div>
    </div>
  )
}

// Icons
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
)

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>
)

const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const GlobeAltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
  </svg>
)

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
)
