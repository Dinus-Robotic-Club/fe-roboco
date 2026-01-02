import { TabItem } from '@/components/ui/tab-item'
import { TABS } from '@/lib'

export const TabNavigation = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: TABS.ONGOING, label: 'ON-GOING MATCH' },
    { id: TABS.FINISHED, label: 'FINISHED MATCH' },
  ]

  return (
    <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
      {tabs.map((tab) => (
        <TabItem key={tab.id} label={tab.label} isActive={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
      ))}
    </nav>
  )
}
