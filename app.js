'use strict';

const Hapi = require('@hapi/hapi');
const fetch = require('node-fetch');
const xmlParser = require('xml2json');
require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.APP_PORT,
        host: process.env.APP_HOST
    });

    server.route({
        method: 'GET',
        path: '/api/products',
        options: {
            cors: true,
            handler: (request, h) => {
                return fetch(`${process.env.ELEVENIA_URI}/rest/prodservices/product/listing`, {
                    headers: {
                        'Content-Type': 'application/xml',
                        'Accept-Charset': 'utf-8',
                        'openapikey': process.env.ELEVENIA_API_KEY
                    }
                })
                .then(response => response.text())
                .then(response => xmlParser.toJson(response))
                .then(response => JSON.parse(response))
                .then(products => products.Products.product)
                .then(data => { 
                    return data.map(product => {
                        return {
                            productName : product.prdNm,
                            sku : prdNo,
                        }
                    })
                 })
                .catch(err => console.log(err));
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();