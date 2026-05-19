import swaggerJsdoc from 'swagger-jsdoc';

import swaggerUi from 'swagger-ui-express';

const options = {

  definition: {
    openapi: '3.0.0',

    info: {
      title: 'MF Service API',
      version: '1.0.0',
    },
  },

  apis: ['./src/routes/*.ts'],
};

const swaggerSpec =
  swaggerJsdoc(options);

export {
  swaggerSpec,
  swaggerUi,
};