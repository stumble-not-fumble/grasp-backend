import cors from "@fastify/cors";
import { ajvFilePlugin, fastifyMultipart } from "@fastify/multipart";
import Fastify from "fastify";

export const app = Fastify({
    logger: true,
    ajv: {
        plugins: [ajvFilePlugin],
    },
});

await app.register(import("@fastify/swagger"), {
    openapi: {
        openapi: "3.1.0",
    },
});
await app.register(import("@fastify/swagger-ui"), {
    routePrefix: "/",
    uiConfig: {
        docExpansion: "full",
        deepLinking: false,
    },
    uiHooks: {
        onRequest: function (request, reply, next) {
            next();
        },
        preHandler: function (request, reply, next) {
            next();
        },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
    },
    transformSpecificationClone: true,
});

await app.register(cors, {
    origin: "*",
});
await app.register(fastifyMultipart, {
    attachFieldsToBody: true,
});

await app.register(import("./routes/search.js"), { prefix: "/search" });
await app.register(import("./routes/upload.js"), { prefix: "/upload" });

try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
