
import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import { news } from "../data/siteData.js";
import "../styles/news.css";

const tags = ["All", ...new Set(news.map((item) => item.tag))];

export default function News() {
  const [tag, setTag] = useState("All");

  const items =
    tag === "All"
      ? news
      : news.filter((item) => item.tag === tag);

  return (
    <>
      <PageHero
        eyebrow="NEWS & UPDATES"
        title="Latest News & Announcements"
        subtitle="Discover the latest announcements, developments, and updates from the Samsy ecosystem."
      />

      <section className="section container news-section">
        <div className="news-intro">
          <div>
            <span className="news-eyebrow">INSIDE SAMSY</span>
            <h2>Latest Stories</h2>
            <p>
              Explore announcements, milestones, events, and
              developments across the Samsy ecosystem.
            </p>
          </div>

          <span className="news-count">
            {String(items.length).padStart(2, "0")} STORIES
          </span>
        </div>

        <div className="filters news-filters" aria-label="Filter news">
          {tags.map((itemTag) => (
            <button
              key={itemTag}
              type="button"
              className={`chip ${itemTag === tag ? "is-active" : ""}`}
              onClick={() => setTag(itemTag)}
              aria-pressed={itemTag === tag}
            >
              {itemTag}
            </button>
          ))}
        </div>

        {items.length > 0 ? (
          <div className="news-grid">
            {items.map((item, index) => (
              <article className="card news-card" key={item.title}>
                <div className="news-card-top">
                  <time dateTime={item.date}>
                    {item.date}
                  </time>

                  <span className="news-tag">{item.tag}</span>
                </div>

                <div className="news-card-content">
                  <span className="news-index">
                    STORY {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{item.title}</h3>

                  <p>{item.body}</p>
                </div>

                <div className="news-card-footer">
                  <span className="news-source">
                    {item.source || "SAMSY Updates"}
                  </span>

                  {item.url ? (
                    <a
                      className="news-read-more"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Read more: ${item.title}`}
                    >
                      Read more <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="news-announcement">
                      Official Update
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="news-empty">
            <h3>No stories found</h3>
            <p>There are no stories in this category yet.</p>

            <button
              type="button"
              className="chip is-active"
              onClick={() => setTag("All")}
            >
              View all stories
            </button>
          </div>
        )}
      </section>
    </>
  );
}
