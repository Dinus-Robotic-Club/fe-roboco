import CardMatch, { ICardMatch } from '../ui/CardMatch'

function OngoingMatch({ data }: { data: ICardMatch[] }) {
    console.log(data)

    return (
        <>
            {data.map((dat) => (
                <CardMatch key={dat.uid} data={dat} />
            ))}
        </>
    )
}

export default OngoingMatch
