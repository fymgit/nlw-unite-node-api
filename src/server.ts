import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { z } from 'zod';
import { PrismaClient } from '@prisma/client'
import { generateSlug } from "./utils/generate-slug";
import { error } from "console";

import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { fastifyCors } from "@fastify/cors";

import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./error-handling";


const app = fastify()

app.register(fastifyCors, {
    origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)



// a definir : Metodos HTTTP - GET, POST, PUT, DELETE, PATCH< HEAD, OPTIONS ....
// Corpo da requisição (Request Body)
// Parâmetros de busca (Search Params / Query Params)
// Parâmetros de rotas (Route Params) -> identificar recursos 
// Cabeçalhos (Headers) -> Contexto

//configurar db
// Driver nativo / Query Builders // ORMs
// ORM -> Object Relative Mapping

// status code 
// 20x -> code de sucesso
// 30x -> code de redirecionamento
// 40x -> code de client-error (Erro em alguma informação enviada por QUEM está fazendo a chamda para a API)
// 50x -> code de  internal-error (Erro que está acontecendo IDEPENDENTE do que está sendo enviado parao server)



//configurando rotas
app.get('/', (req) => {
    //console.log(req);
    return "NLW"
})

// criação da documentação da API usando o fastify swagger
app.register(fastifySwagger, {
    swagger: {
      consumes: ['application/json'],
      produces: ['application/json'],
      info: {
        title: 'pass.in',
        description: 'Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.',
        version: '1.0.0'
      },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})


//criar rota de criação de evento
app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)

//configuração de tratamento de erro
app.setErrorHandler(errorHandler)


//configurando port do server
app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log("Server On!")
})

