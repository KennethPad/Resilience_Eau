import swaggerJSDoc from 'swagger-jsdoc';

export default swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Documentation de l'API (Résilience Eau)",
            description: "Bienvenue sur la documentation API de Résilience Eau. <br/> Elle permet de connaître les différents endpoints accessibles par les utilisateurs afin de récupérer : <br/> - les périodes de pluie prévues pour les 3 prochains jours <br/> - les températures prévues pour les prochaines 24 heures.",
            version: '1.0.0',
        },
    },
    apis: [ './src/routes/*.js' ]
});