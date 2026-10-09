import PageHero from "../components/PageHero.jsx";
import lion from "../assets/lion.svg";
import { market, tokenomics } from "../data/siteData.js";

const facts = [
  ["Token Name", "SMZ"],
  ["Type", "Utility Token"],
  ["Network", "Samsy Blockchain"],
  ["Total Supply", "1,000,000,000 SMZ"],
  ["Contract", "0x0000…0000"],
];

export default function SMZToken() {
  const smz = market[0];
  return (
    <>
      <PageHero eyebrow="SMZ TOKEN" title="Utility Token for the Samsy Ecosystem" subtitle="SMZ powers payments, rewards and services across every Samsy product." />
      <section className="section container two-col">
        <div className="panel panel--dark token-hero">
          <img src={lion} alt="SMZ" />
          <div>
            <span className="muted-light">Current price</span>
            <strong className="big">{smz.price}</strong>
            <em className="up">{smz.change}</em>
          </div>
        </div>
        <table className="table">
          <tbody>
            {facts.map(([k, v]) => (<tr key={k}><th>{k}</th><td>{v}</td></tr>))}
          </tbody>
        </table>
      </section>

      <section className="section section--tint">
        <div className="container">
          <h2 className="center">Tokenomics</h2>
          <div className="bars">
            {tokenomics.map((t) => (
              <div className="bar" key={t.label}>
                <div className="bar__row"><span>{t.label}</span><strong>{t.value}%</strong></div>
                <div className="bar__track"><div className="bar__fill" style={{ width: `${t.value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
