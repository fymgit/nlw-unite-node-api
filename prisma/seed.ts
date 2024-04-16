import { disconnect } from 'process'
import {prisma} from '../src/lib/prisma'


async function seed() {
    await prisma.event.create({
        data: {
            id: '3a82ad73-8c56-4107-8b99-a9efed3609d5',
            title: "NLW Summit 2024",
            slug: "nlw-summit",
            details: "Evento para todos os DEVs",
            maximumAttendees: 100
        }
    })
}

seed().then(() => {
    console.log("Database seeded!")
    prisma.$disconnect()
})