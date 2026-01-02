import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormInputTournament } from '@/components/ui/input'
import { FieldLabel } from '@/components/ui/label'
import { FormSelect } from '@/components/ui/select'
import { FormTextArea } from '@/components/ui/text-area'
import { generateSlug } from '@/lib/function'
import { IPropsInputTournament } from '@/lib/types'
import { CalendarIcon, FileImage, Hash, Info, MapPin, Type } from 'lucide-react'

const FormInputTurney = ({ isForm, setIsForm, isStage, setIsStage, submitForm, isPending }: IPropsInputTournament) => {
  const handleChangeName = (name: string) => {
    setIsForm((prev) => ({ ...prev, name, slug: generateSlug(name) }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setIsForm((prev) => ({ ...prev, image: file }))
  }

  return (
    <DialogContent className="sm:max-w-175 max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white border-none shadow-2xl">
      {/* HEADER: Sticky di atas */}
      <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <DialogTitle className="text-xl font-bold text-slate-900">Buat Turnamen Baru</DialogTitle>
        <DialogDescription className="text-slate-500 text-sm">Lengkapi detail di bawah untuk mempublikasikan kompetisi.</DialogDescription>
      </DialogHeader>

      {/* BODY: Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <form id="tournament-form" onSubmit={submitForm} className="flex flex-col gap-8 p-6">
          {/* Section 1: Informasi Utama */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBFF00]"></span>
              Informasi Utama
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInputTournament label="Nama Turnamen" icon={Type} required placeholder="Contoh: DN ROBOCO 2025" value={isForm.name as string} onChange={(e) => handleChangeName(e.target.value)} />

              <FormInputTournament
                label="Slug URL"
                icon={Hash}
                readOnly
                value={isForm.slug as string}
                placeholder="otomatis-terisi"
                helperText="URL unik untuk turnamen ini (Auto-generated)."
                className="opacity-70 bg-slate-50"
              />
            </div>

            <FormTextArea
              label="Deskripsi Singkat"
              icon={Info}
              placeholder="Jelaskan detail turnamen secara singkat..."
              value={isForm.description ?? ''}
              onChange={(e) => setIsForm({ ...isForm, description: e.target.value })}
            />
          </section>

          <div className="h-px bg-slate-100 w-full" />

          {/* Section 2: Logistik & Waktu */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBFF00]"></span>
              Logistik & Waktu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInputTournament
                label="Lokasi Venue"
                icon={MapPin}
                placeholder="Contoh: Gedung Serbaguna UDINUS"
                value={isForm.location ?? ''}
                onChange={(e) => setIsForm({ ...isForm, location: e.target.value })}
              />

              <div className="flex flex-col">
                <FieldLabel label="Banner / Gambar" icon={FileImage} />
                <input
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FBFF00] file:text-black hover:file:bg-yellow-400 transition-all cursor-pointer border border-slate-200 rounded-lg bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 ml-1">Format: JPG, PNG. Max 2MB.</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <FormInputTournament
                label="Tanggal Mulai"
                icon={CalendarIcon}
                type="date"
                required
                value={isForm.startDate as string}
                onChange={(e) => setIsForm({ ...isForm, startDate: e.target.value })}
              />
              <FormInputTournament label="Tanggal Selesai" icon={CalendarIcon} type="date" value={isForm.endDate as string} onChange={(e) => setIsForm({ ...isForm, endDate: e.target.value })} />
            </div>
          </section>

          <div className="h-px bg-slate-100 w-full" />

          {/* Section 3: Format Kompetisi */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBFF00]"></span>
              Format Kompetisi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormSelect
                label="Tipe Stage"
                required
                value={isForm.stageType ?? ''}
                onChange={(e) => {
                  const val = e.target.value as StageType
                  setIsForm({ ...isForm, stageType: val })
                  setIsStage(val)
                }}>
                <option value="" disabled>
                  Pilih Tipe Stage
                </option>
                <option value="SINGLE_STAGE">Single Stage (Langsung Playoff)</option>
                <option value="DOUBLE_STAGE">Double Stage (Group + Playoff)</option>
              </FormSelect>

              {isStage === 'DOUBLE_STAGE' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormSelect label="Format Playoff" required value={isForm.playoffType ?? ''} onChange={(e) => setIsForm({ ...isForm, playoffType: e.target.value as PlayoffType })}>
                    <option value="" disabled>
                      Pilih Format
                    </option>
                    <option value="SINGLE_ELIM">Single Elimination</option>
                    <option value="DOUBLE_ELIM">Double Elimination</option>
                  </FormSelect>
                </div>
              )}
            </div>
          </section>
        </form>
      </div>

      {/* FOOTER: Sticky di bawah */}
      <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-10 sm:justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="ghost" className="text-slate-500 hover:text-slate-800 hover:bg-slate-200/50">
            Batalkan
          </Button>
        </DialogClose>

        {/* Tombol submit ini mentrigger form dengan id="tournament-form" */}
        <Button type="submit" form="tournament-form" disabled={isPending} className="bg-[#FBFF00] hover:bg-[#eef300] text-black font-semibold shadow-sm px-6 min-w-35">
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
              Menyimpan...
            </span>
          ) : (
            'Buat Turnamen'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export { FormInputTurney }
