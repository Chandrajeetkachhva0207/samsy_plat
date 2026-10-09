import { Link } from "react-router-dom";
import Sparkline from "../Sparkline.jsx";
import logo from "../../assets/logo.svg";
import { market } from "../../data/siteData.js";

function Coin({ type, symbol }) {
  if (type === "samsy") {
    return (
      <span className="coin coin--samsy">
        <img src={logo} alt={symbol} />
      </span>
    );
  }

  if (type === "btc") {
    return <span className="coin coin--btc">₿</span>;
  }

  return <span className="coin coin--eth">Ξ</span>;
}

export default function MarketStrip() {
  return (
    <section className="market">
      <div className="container market__inner">
        <div className="market__title">
          <strong>Live Market Data</strong>
          <span>Real-time price &amp; market information</span>
        </div>

        <div className="market__cards">
          {market.map((m, index) => (
            <div
              className="market__card"
              key={m.symbol}
              style={{ "--card-index": index }}
            >
              <Coin type={m.type} symbol={m.symbol} />

              <div className="market__info">
                <span className="market__sym">{m.symbol}</span>
                <strong>{m.price}</strong>
                <em>{m.change}</em>
              </div>

              <Sparkline seed={m.seed} />
            </div>
          ))}
        </div>

        <Link
          to="/blockchain-explorer"
          className="btn btn--ghost btn--sm market__view-btn"
        >
          View All Markets →
        </Link>
      </div>
    </section>
  );
}

