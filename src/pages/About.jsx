
import { motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import founderImg from "../assets/founder.png";
import { about } from "../data/siteData.js";
import "../styles/About.css";

const values = [
  {
    icon: "shield",
    title: "Trust & Transparency",
    text: "Every transaction is verifiable on-chain.",
  },
  {
    icon: "users",
    title: "Digital Inclusion",
    text: "Technology for individuals, freelancers and MSMEs.",
  },
  {
    icon: "pay",
    title: "Financial Freedom",
    text: "Fast, secure and global digital payments.",
  },
];

const stats = [
  { value: "100M+", label: "Users Target" },
  { value: "50+", label: "Countries" },
  { value: "1000+", label: "MSMEs Support" },
  { value: "∞", label: "Growth Potential" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <main className="about-page">
      <PageHero
        eyebrow="ABOUT SAMSY"
        title="Building a Stronger Digital Tomorrow"
        subtitle={about.text}
      />

      {/* Vision, Mission and Impact */}
      <section className="about-intro">
        <div className="about-container about-intro-grid">
          <motion.div
            className="about-purpose"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
          >
            <span className="about-eyebrow">WHO WE ARE</span>
            <h2>One Ecosystem. Endless Possibilities.</h2>

            <div className="about-purpose-item">
              <span className="about-icon">
                <Icon name="shield" size={21} />
              </span>
              <div>
                <h3>Our Vision</h3>
                <p>
                  A Swadeshi blockchain ecosystem offering secure, fair
                  and accessible digital services to everyone.
                </p>
              </div>
            </div>

            <div className="about-purpose-item">
              <span className="about-icon">
                <Icon name="users" size={21} />
              </span>
              <div>
                <h3>Our Mission</h3>
                <p>
                  Empowering MSMEs and freelancers through payments,
                  commerce, digital identity, content and AI tools.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-impact"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.12 }}
          >
            <div className="about-impact-heading">
              <span className="about-eyebrow">OUR GROWING IMPACT</span>
              <span className="about-live-dot" />
            </div>

            <div className="about-stats">
              {stats.map((stat, index) => (
                <motion.div
                  className="about-stat"
                  key={stat.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.1,
                  }}
                >
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </motion.div>
              ))}
            </div>

            <p className="about-impact-note">
              <span />
              Building a connected digital future
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-values-section">
        <div className="about-container">
          <motion.div
            className="about-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <span className="about-eyebrow">WHAT GUIDES US</span>
              <h2>Our Core Values</h2>
            </div>
            <p>
              The principles behind our commitment to a secure,
              inclusive and connected digital ecosystem.
            </p>
          </motion.div>

          <div className="about-values-grid">
            {values.map((value, index) => (
              <motion.article
                className="about-value-card"
                key={value.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <div className="about-value-top">
                  <span className="about-icon">
                    <Icon name={value.icon} size={22} />
                  </span>
                  <span className="about-value-number">
                    0{index + 1}
                  </span>
                </div>

                <h3>{value.title}</h3>
                <p>{value.text}</p>
                <span className="about-card-line" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="about-founder-section">
        <motion.div
          className="about-container about-founder"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
        >
          <div className="about-founder-content">
            <span className="about-eyebrow">THE PERSON BEHIND SAMSY</span>
            <h2>Meet Our Founder</h2>
            <h3>{about.founder}</h3>
            <p className="about-founder-role">{about.founderRole}</p>

            <blockquote>{about.quote}</blockquote>

            <div className="about-founder-signoff">
              <span />
              Building the future, together.
            </div>
          </div>

          <div className="about-founder-visual">
            <div className="about-founder-glow" />
            <img src={founderImg} alt={about.founder} />
            <div className="about-founder-badge">
              <span className="about-icon">
                <Icon name="shield" size={20} />
              </span>
              <div>
                <strong>Visionary Leadership</strong>
                <span>Innovation with purpose</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
