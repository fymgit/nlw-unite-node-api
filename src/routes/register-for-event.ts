import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";
 


export async function registerForEvent(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', {
        schema: {
            summary: "Register an attendee",
            tags: ['attendees'],
            body: z.object({
                name: z.string().min(4),
                email: z.string().email()
            }),
            params : z.object({
                eventId: z.string().uuid()
            }),
            reponse: {
                201: z.object({
                    attendeeId: z.number()
                })
            }
        }
    }, async (request, reply) => {

        //dados passados pelo body da requisição
        const { eventId } = request.params
        const {name, email} = request.body
        

        //verificação de duplicidade de email
        const attendeeFromEmail = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    email,
                    eventId
                }
            }
        })

        if(attendeeFromEmail !== null) {
            throw new BadRequest("This email has already been used.")
        }

        // verificação de número máximo de participantes do evento indicado
        // const event = await prisma.event.findUnique({
        //     where: {
        //         id: eventId
        //     }
        // })
        
        // retorna o número máximo de registros
        // const amountAttendeesDorEvent = await prisma.attendee.count({
        //     where: {
        //         eventId
        //     }
        // })

        // uso de recurso de Promise para realizar duas chamadas que são independentes em paralelo
        // a Promise retorna um valor qdo as duas chamadas são resolvidas, e armazena numa const
        // ainda é possível fazer um destructuring da resposta e atribuir a um valor de variável pra cada uma delas
        const [event, amountAttendeesDorEvent] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId
                }
            }),
            prisma.attendee.count({
                where: {
                    eventId
                }
            })
        ])


        if(event?.maximumAttendees && amountAttendeesDorEvent >= event?.maximumAttendees) {
            throw new Error("The maxium number of attendees has been reached.")
        }
        


        // criação de um novo attendee após as verificações feitas
        const attendee = await prisma.attendee.create({
            data: {
                name,
                email,
                eventId
            }
        })

        return reply.status(201).send({ attendeeId: attendee.id })
    })  
}