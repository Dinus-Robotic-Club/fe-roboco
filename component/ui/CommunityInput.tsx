import { IGetAllCommunity } from '@/lib/types/type'
import { useState, useMemo } from 'react'

type Props = {
    communities: IGetAllCommunity[]
    value: string
    onChange: (val: string) => void
}

export default function CommunityInput({ communities, value, onChange }: Props) {
    const [open, setOpen] = useState(false)

    // filtered communities (no any here)
    const filtered = useMemo(() => {
        if (!value) return communities
        const lower = value.toLowerCase()
        return communities?.filter((c) => c.name.toLowerCase().includes(lower))
    }, [value, communities])

    return (
        <div className="relative w-full">
            <label className="text-sm lg:text-base font-fira-code mb-1 block">KOMUNITAS ATAU SEKOLAH</label>

            {/* INPUT */}
            <input
                type="text"
                value={value}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                    onChange(e.target.value)
                    setOpen(true)
                }}
                placeholder="Masukkan komunitas atau sekolah"
                className="p-3 sm:p-4 bg-white rounded-xs w-full outline-none
        text-sm lg:text-base font-plus-jakarta-sans shadow-md"
            />

            {/* AUTOCOMPLETE */}
            {open && filtered.length > 0 && (
                <div
                    className="absolute mt-1 w-full bg-white shadow-md rounded-xs 
        max-h-48 overflow-auto z-20 border"
                >
                    {filtered.map((item) => (
                        <div
                            key={item?.uid}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                                onChange(item?.name)
                                setOpen(false)
                            }}
                        >
                            {item?.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
