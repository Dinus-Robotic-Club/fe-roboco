import { ParticipantCard } from '@/components/ui/card'
import { FormInput, PasswordInput } from '@/components/ui/input'
import { getImageUrl } from '@/lib/function'
import { ITeamProfileProps } from '@/lib/types'
import Image from 'next/image'

function TeamProfile({ data, bodyTeam, setBodyTeam, setBodyParticipant, error }: ITeamProfileProps) {
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBodyTeam?.((prev) => ({ ...prev, name: e.target.value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setBodyTeam?.((prev) => ({ ...prev, logo: file }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBodyParticipant?.((prev) => ({ ...prev, password: e.target.value }))
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBodyParticipant?.((prev) => ({ ...prev, confirmPassword: e.target.value }))
  }

  return (
    <>
      <div className="">
        <h1 className="text-2xl lg:text-3xl font-bold">TEAM PROFILE</h1>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-wrap justify-center items-center gap-30">
          {data.participants.map((pt, i) => (
            <ParticipantCard key={i} participant={pt} />
          ))}
        </div>
      </div>

      <div className="mt-20 max-w-4xl w-full md:px-4 flex flex-col items-center gap-10">
        <div className="bg-logo-team w-30.75 h-30.75">
          <Image src={getImageUrl(data.logo)} alt="logo-team" height={10000} width={10000} className="w-full h-full p-2" />
        </div>

        <div className="flex flex-col gap-5 sm:gap-8 w-full">
          <div className="flex gap-5 w-full flex-col sm:flex-row">
            <FormInput id="team_name" label="TEAM NAME" placeholder="Team Name" value={bodyTeam?.name || ''} onChange={handleTeamNameChange} errorMessage={error?.name} />

            <FormInput id="logo" label="TEAM LOGO" type="file" accept=".jpg,.png,.jpeg" onChange={handleLogoChange} errorMessage={error?.logo} />
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex gap-5 w-full">
              <PasswordInput id="change_password" label="CHANGE PASSWORD" placeholder="New Password" value={bodyTeam?.password || ''} onChange={handlePasswordChange} errorMessage={error?.password} />
            </div>

            <div className="flex gap-5 w-full">
              <PasswordInput
                id="confirm_password"
                label="CONFIRM PASSWORD"
                placeholder="Confirm Password"
                value={bodyTeam?.confirmPassword || ''}
                onChange={handleConfirmPasswordChange}
                errorMessage={error?.confirmPassword}
              />
            </div>
          </div>

          <button className="bg-[#FBFF00] hover:bg-yellow-300 transition font-fira-code font-medium py-3 mt-2 shadow-md">UPDATE PROFILE</button>
        </div>
      </div>
    </>
  )
}

export { TeamProfile }
