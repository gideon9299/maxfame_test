import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MaxFame Test API Documentation',
            version: '1.0.0',
            description: 'API documentation for the MaxFame Test application',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/models/*.ts', './src/controllers/*.ts', './src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
