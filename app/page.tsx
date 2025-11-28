import About from "@/component/landingPage/About";
import Category from "@/component/landingPage/Category";
import Home from "@/component/landingPage/Home";
import Navbar from "@/component/ui/Global/Navbar";
import { nav_home } from "@/lib";
import Sponsorship from "@/component/landingPage/Sponsorship";
import FooterLandingPage from "@/component/landingPage/FooterLandingPage";

export default function Page() {
  return (
    <main className="bg-grid">
      <Navbar left={nav_home.left} right={nav_home.right} />
      <Home />
      <About />
      <Category />
      <Sponsorship />
      <FooterLandingPage />
    </main>
  );
}
