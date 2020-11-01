const { appsignalssr } = require('./lib/appsignalssr');
const { expressErrorHandler, expressMiddleware } = require('@appsignal/express');
const { getRequestHandler } = require("@appsignal/nextjs");
const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = express()

        server.get('/backend', function (req, res, next) {
            try {
                const error = new Error(
                    `${req.ip} tried to access ${req.originalUrl}`,
                );

                error.statusCode = 500;

                throw error;
            } catch (error) {
                next(error)
            }
        });


        server.get('*', (req, res,next) => {
            return handle(req, res)
        })


        server.use((error, req, res, next) => {
            console.log(req)
            if (!error.statusCode) error.statusCode = 500;
            if (!error.name) error.name = error.toString();
            console.warn('*****an error occured you have to send it to appsignal!****', error )
            // const span = appsignalssr.tracer().createSpan({
            //     namespace: "some namespace - web", // a custom namespace for this span (defaults to `web`)
            //     startTime: Date.now()         // a custom start time for this span. defaults to the current time. value must be a valid 64-bit integer representing a valid UNIX time.
            // });
            const tracer = appsignalssr.tracer();
            const span = tracer.createSpan({
                namespace: "web", // a custom namespace for this span (defaults to `web`)
                startTime: Date.now()         // a custom start time for this span. defaults to the current time. value must be a valid 64-bit integer representing a valid UNIX time.
            });

            span.setName(error.name);
            span.addError(error);
            span.close();

            next();
        });

        /************** it also works ! **************/
        // server.use(expressMiddleware(appsignalssr))
        // server.use(expressErrorHandler(appsignalssr))

        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })