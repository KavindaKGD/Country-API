import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

export const fetchAllCountries = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/all`);
    return res.data;
  } catch (err) {
    console.error("Error fetching countries:", err);
    return [];
  }
};

export const searchCountriesByName = async (name) => {
  try {
    const res = await axios.get(`${BASE_URL}/name/${name}`);
    return res.data;
  } catch (err) {
    return [];
  }
};

export const filterCountriesByRegion = async (region) => {
  try {
    const res = await axios.get(`${BASE_URL}/region/${region}`);
    return res.data;
  } catch (err) {
    return [];
  }
};
