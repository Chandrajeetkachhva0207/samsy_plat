
import { motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import stack from "../assets/ecosystem_img_bg.png";
import { services } from "../data/siteData.js";
import "../styles/ecosystem.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

export default function Ecosystem() {
  return (
    <main className="ecosystem-page">
      <PageHero
        eyebrow="OUR ECOSYSTEM"
        title="One Platform. Endless Possibilities."
        subtitle="Payments, social, commerce, AI, entertainment and utilities — all connected through one blockchain-powered platform."
      />

      {/* Platform overview */}
      <section className="ecosystem-overview">
        <div className="ecosystem-container ecosystem-overview-grid">
          <motion.div
            className="ecosystem-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="ecosystem-visual-glow" />
            <span className="ecosystem-orbit ecosystem-orbit--one" />
            <span className="ecosystem-orbit ecosystem-orbit--two" />

            <motion.img
              src={stack}
              alt="SAMSY applications, blockchain layer and infrastructure"
              animate={{ y: [0, -7, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="ecosystem-visual-caption">
              <span className="ecosystem-status-dot" />
              One connected digital ecosystem
            </div>
          </motion.div>

          <motion.div
            className="ecosystem-overview-content"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <span className="ecosystem-eyebrow">POWERED BY SAMSY</span>

            <h2>
              Everything You Need.
              <span> One Connected Platform.</span>
            </h2>

            <p>
              SAMSY brings essential digital services together in one
              connected ecosystem, helping individuals, freelancers
              and businesses access technology more conveniently.
            </p>

            <div className="ecosystem-benefits">
              <div className="ecosystem-benefit">
                <span className="ecosystem-benefit-icon">
                  <Icon name="shield" size={19} />
                </span>
                <div>
                  <h3>Secure by Design</h3>
                  <p>Built around blockchain technology.</p>
                </div>
              </div>

              <div className="ecosystem-benefit">
                <span className="ecosystem-benefit-icon">
                  <Icon name="users" size={19} />
                </span>
                <div>
                  <h3>Made for Everyone</h3>
                  <p>Supporting people, creators and businesses.</p>
                </div>
              </div>
            </div>

            <a className="ecosystem-cta" href="#ecosystem-services">
              Explore Our Services
              <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main services */}
      <section
        className="ecosystem-services-section"
        id="ecosystem-services"
      >
        <div className="ecosystem-container">
          <motion.div
            className="ecosystem-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div>
              <span className="ecosystem-eyebrow">
                EXPLORE THE ECOSYSTEM
              </span>
              <h2>Services That Work Together</h2>
            </div>

            <p>
              Discover digital solutions designed to simplify everyday
              activities and create new opportunities.
            </p>
          </motion.div>

          <motion.div
            className="ecosystem-services-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {services.map((service, index) => (
              <motion.article
                className="ecosystem-service-card"
                key={service.title}
                id={service.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {/* Official Brand Logo Showcase */}
                <div
                  className={`ecosystem-service-logo-box ${
                    service.logoTheme === "light"
                      ? "ecosystem-service-logo-box--light"
                      : "ecosystem-service-logo-box--dark"
                  }`}
                >
                  {service.logo ? (
                    <img
                      src={service.logo}
                      alt={`${service.title} Logo`}
                      className="ecosystem-service-logo-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="ecosystem-service-logo-fallback">
                      <Icon name={service.icon} size={44} />
                      <span>{service.title}</span>
                    </div>
                  )}
                  {service.badge && (
                    <span className="ecosystem-service-pill">
                      {service.badge}
                    </span>
                  )}
                </div>

                <div className="ecosystem-service-top">
                  <span className="ecosystem-service-icon">
                    <Icon name={service.icon} size={22} />
                  </span>

                  <span className="ecosystem-service-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="ecosystem-service-heading">
                  <h3>{service.title}</h3>
                  {service.brandTitle && service.brandTitle !== service.title && (
                    <span className="ecosystem-service-brand-sub">
                      ({service.brandTitle})
                    </span>
                  )}
                </div>

                <div className="ecosystem-service-meta">
                  <span className="ecosystem-service-tag">
                    {service.text}
                  </span>
                  {service.tagline && (
                    <span className="ecosystem-service-tagline">
                      {service.tagline}
                    </span>
                  )}
                </div>

                <p>{service.desc}</p>

                {service.features && (
                  <ul className="ecosystem-service-features">
                    {service.features.map((feat) => (
                      <li key={feat}>
                        <span className="ecosystem-feature-dot" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}

                <span
                  className="ecosystem-service-accent"
                  aria-hidden="true"
                />
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            className="ecosystem-bottom-note"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="ecosystem-bottom-mark">S</span>
            <p>
              <strong>One ecosystem. Multiple possibilities.</strong>
              <span>
                Connecting digital services through a shared vision.
              </span>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
