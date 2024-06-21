const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "ITI Events Backend API",
            version: "1.0.0",
            description: "Documentation for ITI Events RESTful API",
        },
        servers: [
            {
                url: "https://iti-events-server.onrender.com/api/v1",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts", "./src/errors/*.ts"],
};

export default options;
