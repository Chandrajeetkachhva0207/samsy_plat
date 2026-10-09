import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import { roadmap } from "../data/siteData.js";

export default function Roadmap() {
  return (
    <>
      <PageHero eyebrow="ROADMAP" title="Our Journey to the Future" subtitle="From foundation to global scale." />
      <section className="section container">
        <ol className="timeline">
          {roadmap.map((r) => (
            <li key={r.phase} className={`timeline__item is-${r.status}`}>
              <span className="timeline__dot">{r.status === "done" && <Icon name="check" size={14} />}</span>
              <div className="card">
                <small className="muted">{r.phase} · {r.period}</small>
                <h3>{r.title}</h3>
                <ul>{r.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
