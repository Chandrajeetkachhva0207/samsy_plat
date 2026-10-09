import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import eagle from "../assets/eagle.svg";

const features = [
  { icon: "shield", title: "Secure by Design", text: "Audited consensus and smart-contract layer." },
  { icon: "pay", title: "Low-Cost Transactions", text: "Fast finality with minimal fees." },
  { icon: "users", title: "Built for Scale", text: "Designed to support 100M+ users." },
  { icon: "ai", title: "Developer Friendly", text: "SDKs and APIs for MSMEs and builders." },
];

export default function SM9Project() {
  return (
    <>
      <PageHero eyebrow="SM9 PROJECT" title="Next Gen Blockchain Infrastructure" subtitle="The core network that powers every product in the Samsy ecosystem." />
      <section className="section container two-col">
        <div className="panel panel--gold token-hero">
          <img src={eagle} alt="SM9" />
          <div><strong className="big">SM9</strong><span className="muted-light">Samsy Blockchain Infrastructure</span></div>
        </div>
        <div className="card-grid card-grid--2">
          {features.map((f) => (
            <article className="card" key={f.title}>
              <span className="card__icon"><Icon name={f.icon} size={24} /></span>
              <h3>{f.title}</h3><p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
