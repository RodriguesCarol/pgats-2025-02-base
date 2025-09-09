const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../../rest/app');

const checkoutService = require('../../../src/services/checkoutService.js');


describe('Checkout Controller', () => {
    describe('POST /api/checkout', () => {

        beforeEach(async () => {
            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });

            token = respostaLogin.body.token;


        });

        it('Deve retornar 401 quando o token estiver ausente', async () => {
            const resposta = await request(app)
                .post('/api/checkout')
                .send({
                    cart: [{ productId: 1, quantity: 2 }]
                });

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.have.property('error', 'Token inválido')



        });

        it('Deve retornar 200 quando informado produto e metodo de pagamento', async () => {
            const resposta = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [
                        {
                            productId: 1,
                            quantity: 1
                        }
                    ],
                    freight: 80,
                    paymentMethod: 'boleto',
                    cardData: {
                        number: 'string',
                        name: 'string',
                        expiry: 'string',
                        cvv: 'string'
                    }

                });

            expect(resposta.status).to.equal(200);
            const respostaEsperada = require('../fixture/response/quandoInformoOsDadosDoCheckoutValidoTenhoSucesso200.json')
            expect(resposta.body).to.deep.equal(respostaEsperada);





        });

        it('Usando Mocks: Deve retornar mensagem de erro quando o produto não for encontrado', async () => {
            const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
            checkoutServiceMock.throws(new Error('Produto não encontrado'));


            const resposta = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [
                        {
                            productId: 10,
                            quantity: 1
                        }
                    ],
                    freight: 80,
                    paymentMethod: 'boleto',
                    cardData: {
                        number: 'string',
                        name: 'string',
                        expiry: 'string',
                        cvv: 'string'
                    }

                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Produto não encontrado');

        });


    });

});
