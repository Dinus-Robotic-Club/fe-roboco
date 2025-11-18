import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IGetAllTournaments } from '@/lib/types'
// import Image from 'next/image'
import React from 'react'

const Card = ({ data }: { data: IGetAllTournaments }) => {
    return (
        <div className="w-full min-h-full p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    {/* <Image src={} alt="tournament thumbnail" className="w-full h-40 object-cover" width={100} height={100} /> */}
                    <div className="p-4">
                        <h2 className="text-lg font-semibold">{data.name}</h2>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center mt-4">
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button variant="outline">Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent variant={'yellow'}>
                            {/* <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
                            </DialogHeader> */}
                            {/* <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="username-1">Username</Label>
                                    <Input id="username-1" name="username" defaultValue="@peduarte" />
                                </div>
                            </div> */}
                            {/* <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter> */}
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
        </div>
    )
}

export default Card
