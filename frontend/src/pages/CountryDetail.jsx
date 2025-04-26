import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CountryDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);

  useEffect(() => {
    fetchCountry();
  }, [code]);

  const fetchCountry = async () => {
    try {
      const res = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
      setCountry(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!country) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <button
        onClick={() => navigate("/home")}
        className="mb-6 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-xl shadow-lg grid md:grid-cols-2 gap-6">
        <img
          src={country.flags?.svg}
          alt="Flag"
          className="w-full h-64 object-cover rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            {country.name?.common}
          </h1>
          <p><strong>Official Name:</strong> {country.name?.official}</p>
          <p><strong>Capital:</strong> {country.capital?.[0]}</p>
          <p><strong>Region:</strong> {country.region}</p>
          <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
          <p><strong>Languages:</strong> {country.languages && Object.values(country.languages).join(", ")}</p>
          <p><strong>Currency:</strong> {country.currencies && Object.values(country.currencies)[0]?.name}</p>
          <p><strong>Borders:</strong> {country.borders?.join(", ") || "None"}</p>
        </div>
      </div>
    </div>
  );
}
