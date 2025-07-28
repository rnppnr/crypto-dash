import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import CoinDetailsPage from "./pages/CoinDetailPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const API_URL = import.meta.env.VITE_COINS_API_URL;

const App = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_desc");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          `${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data from API");
        }
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [limit]);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                coins={coins}
                filter={filter}
                setFilter={setFilter}
                limit={limit}
                setLimit={setLimit}
                sortBy={sortBy}
                setSortBy={setSortBy}
                loading={loading}
                error={error}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/coin/:id" element={<CoinDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
