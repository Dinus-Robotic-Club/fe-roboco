import About from '@/components/pages/landing-page/about'
import Category from '@/components/pages/landing-page/category'
import Home from '@/components/pages/landing-page/home'
import QnA from '@/components/pages/landing-page/qna'
import Sponsorship from '@/components/pages/landing-page/sponsor'
import Timeline from '@/components/pages/landing-page/timeline'
import { FooterLandingPage } from '@/components/ui/footer'
import Navbar from '@/components/ui/navbar'
import { nav_home } from '@/lib/statis-data'

const Page = () => {
  return (
    <main className="bg-grid">
      <Navbar left={nav_home.left} right={nav_home.right} />
      <Home />
      <About />
      <Category />
      <Timeline />
      <Sponsorship />
      <QnA />
      <FooterLandingPage />
    </main>
  )
}

export default Page
