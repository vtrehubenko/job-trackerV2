import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Tracker API",
      version: "1.0.0",
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication and authorization",
      },
      {
        name: "Jobs",
        description: "Jobs management",
      },
    ],

    servers: [{ url: "http://localhost:4000" }],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: ["src/routes/**/*.ts"], // 👈 лучше так
});
