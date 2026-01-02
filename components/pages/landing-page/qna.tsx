import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TextQna } from '@/lib/statis-data'

const QnA = () => {
  return (
    <section className="w-full flex flex-col items-center mt-20 pt-10 pb-20 font-plus-jakarta-sans bg-white shadow-2xl px-4 md:px-10">
      <h1 className="text-2xl">FAQ</h1>
      <h1 className="font-bold text-4xl text-center md:text-start  lg:text-5xl 2xl:text-[53px]">Temukan Jawabanmu</h1>
      <p className="font-semibold text-base lg:text-xl text-center mb-8 mt-2 mb:mt-4 max-w-4xl 2xl:max-w-5xl w-full ">
        Masih ada pertanyaan? Temukan jawabannya di sini sebelum kamu mulai perjalanan kompetisimu
      </p>
      <Accordion type="single" collapsible className="max-w-4xl 2xl:max-w-5xl w-full ">
        {TextQna.map((data, i) => (
          <AccordionItem value={`item-${i}`} key={i}>
            <AccordionTrigger>{data.title}</AccordionTrigger>
            <AccordionContent>{data.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export default QnA
