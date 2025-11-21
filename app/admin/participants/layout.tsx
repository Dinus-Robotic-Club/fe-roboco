import Footer from "@/component/ui/Footer";
import Navbar from "@/component/ui/Global/Navbar";
import { nav_participants } from "@/lib";

export default function ParticipantsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="bg-grid">
      <Navbar left={nav_participants.left} right={nav_participants.right} />
      {children}
      <Footer />
    </main>
  );
}
