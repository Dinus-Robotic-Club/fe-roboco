import React from 'react'
import CardMatch, { ICardMatch } from '../ui/CardMatch'

function HistoryMatch({ data }: { data: ICardMatch[] }) {
    return (
        <>
            {data.map((dat) => (
                <CardMatch key={dat.uid} data={dat} />
            ))}
        </>
    )
}

export default HistoryMatch
