import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import Spinner from "../components/Spinner";
import CoinChart from "../components/CoinChart";

const API_URL = import.meta.env.VITE_COIN_API_URL;

const CoinDetailsPage = () => {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch coin details");
        }
        const data = await response.json();
        setCoin(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoinDetails();
  }, [id]);

  return (
    <>
      <h1>Crypto Dash</h1>

      <div className="coin-details-container">
        <Link to="/" className="back-link">
          &larr; Back to Home
        </Link>

        <h2 className="coin-details-name">
          {coin
            ? `${coin.name} (${coin.symbol.toUpperCase()})`
            : "Coin Details"}
        </h2>

        {loading && <Spinner />}
        {error && <div className="error">Error: {error}</div>}

        {!loading && !error && coin && (
          <div className="coin-details">
            <img
              src={coin.image.large}
              alt={coin.name}
              className="coin-details-image"
            />
            <p>
              <strong>Description:</strong> {coin.description.en.split(". ")[0]}
              .
            </p>
            <div className="coin-details-info">
              <h3>Rank: {coin.market_cap_rank}</h3>
              <h3>
                Current Price: $
                {coin.market_data.current_price.usd.toLocaleString()}
              </h3>
              <h4>
                Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}
              </h4>
              <h4>
                24h High: ${coin.market_data.high_24h.usd.toLocaleString()}
              </h4>
              <h4>24h Low: ${coin.market_data.low_24h.usd.toLocaleString()}</h4>
              <h4>
                24h Change:{" "}
                <span
                  className={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </span>
              </h4>
              <h4>
                Circulating Supply:{" "}
                {coin.market_data.circulating_supply.toLocaleString()}
              </h4>
              <h4>
                Total Supply:{" "}
                {coin.market_data.total_supply
                  ? coin.market_data.total_supply.toLocaleString()
                  : "N/A"}
              </h4>
              <h4>
                All-Time High: ${coin.market_data.ath.usd.toLocaleString()} on{" "}
                {new Date(coin.market_data.ath_date.usd).toLocaleDateString()}
              </h4>
              <h4>
                All-Time Low: ${coin.market_data.atl.usd.toLocaleString()} on{" "}
                {new Date(coin.market_data.atl_date.usd).toLocaleDateString()}
              </h4>
              <h4>
                Last Updated:{" "}
                {new Date(coin.market_data.last_updated).toLocaleDateString()}
              </h4>
            </div>

            <CoinChart coinId={coin.id} />

            <div className="coin-details-links">
              {coin.links.homepage[0] && (
                <p>
                  <a
                    href={coin.links.homepage[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </a>
                </p>
              )}
              {coin.links.blockchain_site[0] && (
                <p>
                  <a
                    href={coin.links.blockchain_site[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blockchain
                  </a>
                </p>
              )}

              {coin.categories.length > 0 && (
                <div>
                  <strong>Categories:</strong>{" "}
                  {coin.categories.map((category, index) => (
                    <span key={index}>
                      {category}
                      {index < coin.categories.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {!loading && !error && !coin && (
              <p>No details available for this coin.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CoinDetailsPage;
