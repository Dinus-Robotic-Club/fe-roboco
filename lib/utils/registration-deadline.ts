// Registration deadline: January 12, 2026 at 3:00 PM WIB (UTC+7)
export const REGISTRATION_DEADLINE = new Date('2026-01-12T15:00:00+07:00')

export const isRegistrationOpen = (): boolean => {
  return new Date() < REGISTRATION_DEADLINE
}

export const getTimeUntilDeadline = (): { days: number; hours: number; minutes: number; isOpen: boolean } => {
  const now = new Date()
  const distance = REGISTRATION_DEADLINE.getTime() - now.getTime()

  if (distance < 0) {
    return { days: 0, hours: 0, minutes: 0, isOpen: false }
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    isOpen: true,
  }
}
