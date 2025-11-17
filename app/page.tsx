import About from "@/component/landingPage/About";
import Category from "@/component/landingPage/Category";
import Footer from "@/component/ui/Footer";
import Home from "@/component/landingPage/Home";
import Navbar from "@/component/ui/Navbar";
import { nav_home } from "@/lib";

export default function Page() {
  return (
    <main>
      <Navbar left={nav_home.left} right={nav_home.right} />
      <Home />
      <About />
      <Category />
      <Footer />
    </main>
  );
}
