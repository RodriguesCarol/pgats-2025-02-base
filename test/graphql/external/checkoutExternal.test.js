const request = require('supertest');
const { expect, use } = require('chai');

describe('Checkout External', () => {
    describe('POST /api/checkout', () => {

        beforeEach(async () => {
            const login = require('../fixture/requisicao/login/login.json');
            const respostaLogin = await request('http://localhost:4000/graphql')
                .post('')
                .send(login);

            token = respostaLogin.body.data.login.token;




        });

        it('Deve retornar 200 quando informado um produto válido e o metodo de pagamento "boleto" ', async () => {
            const checkoutBody = require('../fixture/requisicao/checkout/checkout.json')
            const resposta = await request('http://localhost:4000/graphql')
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(checkoutBody);

            expect(resposta.status).to.equal(200);

            const checkout = resposta.body.data.checkout;

            expect(checkout).to.have.property('paymentMethod', 'boleto');
            expect(checkout.items[0]).to.have.property('productId', 1);


        });
        it('Deve retornar uma mensagem de erro quando não informado o token ', async () => {
            const checkoutBody = require('../fixture/requisicao/checkout/checkout.json')
            const resposta = await request('http://localhost:4000/graphql')
                .post('')
                .send(checkoutBody);



            expect(resposta.status).to.equal(200);
            expect(resposta.body.errors[0].message).to.equal('Token inválido');

        });
    });
});



















