
import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import sm9Logo from "../assets/sm9-logo.png";
import "../styles/sm9_project.css";

const features = [
  {
    icon: "shield",
    title: "Secure by Design",
    text: "Audited consensus and smart-contract layer.",
  },
  {
    icon: "pay",
    title: "Low-Cost Transactions",
    text: "Fast finality with minimal fees.",
  },
  {
    icon: "users",
    title: "Built for Scale",
    text: "Designed to support 100M+ users.",
  },
  {
    icon: "ai",
    title: "Developer Friendly",
    text: "SDKs and APIs for MSMEs and builders.",
  },
];

export default function SM9Project() {
  return (
    <>
      <PageHero
        eyebrow="SM9 PROJECT"
        title="Next Gen Blockchain Infrastructure"
        subtitle="The core network that powers every product in the Samsy ecosystem."
      />

      <section className="section container two-col sm9-project-section">
        <div className="panel panel--gold token-hero sm9-token-hero">
          <div className="sm9-eagle-wrap">
            <img src={sm9Logo} alt="SM9 blockchain emblem" />
          </div>

          <div className="sm9-token-content">
            <span className="sm9-token-label">
              SAMSY BLOCKCHAIN INFRASTRUCTURE
            </span>
            <strong className="big">SM9</strong>
            <span className="muted-light">
              Powering the Samsy digital ecosystem
            </span>
          </div>
        </div>

        <div className="card-grid card-grid--2 sm9-features">
          {features.map((feature, index) => (
            <article className="card sm9-feature" key={feature.title}>
              <div className="sm9-feature-heading">
                <span className="card__icon">
                  <Icon name={feature.icon} size={24} />
                </span>
                <span className="sm9-feature-number">
                  0{index + 1}
                </span>
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
