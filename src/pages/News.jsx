import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import { news } from "../data/siteData.js";

const tags = ["All", ...new Set(news.map((n) => n.tag))];

export default function News() {
  const [tag, setTag] = useState("All");
  const items = tag === "All" ? news : news.filter((n) => n.tag === tag);
  return (
    <>
      <PageHero eyebrow="NEWS" title="Latest News & Announcements" subtitle="Updates from the Samsy team." />
      <section className="section container">
        <div className="filters">
          {tags.map((t) => (
            <button key={t} className={`chip ${t === tag ? "is-active" : ""}`} onClick={() => setTag(t)}>{t}</button>
          ))}
        </div>
        <div className="card-grid card-grid--2">
          {items.map((n) => (
            <article className="card" key={n.title}>
              <div className="card__top"><time className="muted">{n.date}</time><span className={`tag tag--${n.tag.toLowerCase()}`}>{n.tag}</span></div>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
