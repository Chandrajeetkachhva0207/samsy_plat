import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";

const sections = ["Introduction", "Problem & Solution", "Samsy Ecosystem", "Technology & Architecture", "Tokenomics", "Roadmap", "Team & Legal"];

export default function Whitepaper() {
  return (
    <>
      <PageHero eyebrow="WHITEPAPER" title="Official Samsy Whitepaper" subtitle="Everything about our technology, token and vision." />
      <section className="section container two-col">
        <div className="panel panel--dark wp-card">
          <Icon name="doc" size={48} />
          <h3>Samsy Whitepaper v1.0</h3>
          {/* Put your PDF in /public/whitepaper.pdf */}
          <a className="btn btn--primary" href="/whitepaper.pdf" download>Download PDF</a>
        </div>
        <div>
          <h2>What's inside</h2>
          <ul className="check-list">
            {sections.map((s) => (<li key={s}><Icon name="check" size={16} /> {s}</li>))}
          </ul>
        </div>
      </section>
    </>
  );
}
