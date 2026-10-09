import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import { explorerStats, explorerBlocks } from "../data/siteData.js";

export default function BlockchainExplorer() {
  const [q, setQ] = useState("");
  return (
    <>
      <PageHero eyebrow="EXPLORER" title="Blockchain Explorer" subtitle="View on-chain activity in real time." />
      <section className="section container">
        <form className="explorer-search" onSubmit={(e) => e.preventDefault() /* TODO: hook to explorer API */}>
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by address, transaction hash or block number" />
          <button className="btn btn--primary btn--sm">Search</button>
        </form>

        <ul className="stats stats--light stats--4">
          {explorerStats.map((s) => (<li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>))}
        </ul>

        <h2>Latest Blocks</h2>
        <div className="table-wrap">
          <table className="table table--full">
            <thead><tr><th>Block</th><th>Hash</th><th>Txns</th><th>Time</th></tr></thead>
            <tbody>
              {explorerBlocks.map((b) => (
                <tr key={b.block}><td>{b.block}</td><td>{b.hash}</td><td>{b.txs}</td><td>{b.time}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
