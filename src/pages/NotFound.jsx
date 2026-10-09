import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

export default function NotFound() {
  return (
    <>
      <PageHero title="Page not found" subtitle="The page you're looking for doesn't exist." />
      <section className="section container center"><Link to="/" className="btn btn--primary">Back to Home</Link></section>
    </>
  );
}
