import Image from 'next/image'
import logoImage from '@/public/logo-only.svg'

const NavLogo = () => {
  return (
    <div className="h-full flex justify-center">
      <div className="logo-container flex items-center justify-center p-2 rounded-xl">
        <div className="text-center">
          <Image src={logoImage} alt="logo roboco" className="drop-shadow-xl" />
        </div>
      </div>
    </div>
  )
}

export default NavLogo
