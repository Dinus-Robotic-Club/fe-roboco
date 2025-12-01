import React from 'react'
import CardMatch, { ICardMatch } from '../ui/CardMatch'
import EmptyState from '../ui/Global/not-found-data'

function HistoryMatch({ data }: { data: ICardMatch[] }) {
    if (!data || data.length === 0) {
        return <EmptyState variant="public" className="w-full max-w-4xl h-auto " title="COMING SOON" description="Arena Pertandingan Robot Segera Tiba... " />
    }
    return (
        <>
            {data?.map((dat) => (
                <CardMatch key={dat?.uid} data={dat} />
            ))}
        </>
    )
}

export default HistoryMatch
