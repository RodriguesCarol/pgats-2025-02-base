# API Checkout Rest e GraphQL

Se você é aluno da Pós-Graduação em Automação de Testes de Software (Turma 2), faça um fork desse repositório e boa sorte em seu trabalho de conclusão da disciplina.

## Instalação

```bash
npm install express jsonwebtoken swagger-ui-express apollo-server-express graphql
```

## Exemplos de chamadas

### REST

#### Registro de usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Novo Usuário","email":"novo@email.com","password":"senha123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"novo@email.com","password":"senha123"}'
```

#### Checkout (boleto)
```bash
curl -X POST http://localhost:3000/api/checkout \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN_JWT>" \
	-d '{
		"items": [{"productId":1,"quantity":2}],
		"freight": 20,
		"paymentMethod": "boleto"
	}'
```

#### Checkout (cartão de crédito)
```bash
curl -X POST http://localhost:3000/api/checkout \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN_JWT>" \
	-d '{
		"items": [{"productId":2,"quantity":1}],
		"freight": 15,
		"paymentMethod": "credit_card",
		"cardData": {
			"number": "4111111111111111",
			"name": "Nome do Titular",
			"expiry": "12/30",
			"cvv": "123"
		}
	}'
```

### GraphQL

#### Registro de usuário
Mutation:
```graphql
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    email
    name
  }
}

Variables:
{
  "name": "Julio",
  "email": "julio@abc.com",
  "password": "123456"
}
```

#### Login
Mutation:
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
  }
}

Variables:
{
  "email": "alice@email.com",
  "password": "123456"
}
```


#### Checkout (boleto)
Mutation (envie o token JWT no header Authorization: Bearer <TOKEN_JWT>):
```graphql
mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!, $cardData: CardDataInput) {
  checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod, cardData: $cardData) {
    freight
    items {
      productId
      quantity
    }
    paymentMethod
    userId
    valorFinal
  }
}

Variables:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "freight": 10,
  "paymentMethod": "boleto"
}
```

#### Checkout (cartão de crédito)
Mutation (envie o token JWT no header Authorization: Bearer <TOKEN_JWT>):
```graphql
mutation {
	checkout(
		items: [{productId: 2, quantity: 1}],
		freight: 15,
		paymentMethod: "credit_card",
		cardData: {
			number: "4111111111111111",
			name: "Nome do Titular",
			expiry: "12/30",
			cvv: "123"
		}
	) {
		valorFinal
		paymentMethod
		freight
		items { productId quantity }
	}
}

Variables:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "freight": 10,
  "paymentMethod": "credit_card",
  "cardData": {
    "cvv": "123",
    "expiry": "10/04",
    "name": "Julio Costa",
    "number": "1234432112344321"
  }
}
```

#### Consulta de usuários
Query:
```graphql
query Users {
  users {
    email
    name
  }
}
```

## Como rodar

### REST
```bash
node rest/server.js
```
Acesse a documentação Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### GraphQL
```bash
node node graphql/server.js
```
Acesse o playground GraphQL em [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Endpoints REST
- POST `/api/users/register` — Registro de usuário
- POST `/api/users/login` — Login (retorna token JWT)
- POST `/api/checkout` — Checkout (requer token JWT)

## Regras de Checkout
- Só pode fazer checkout com token JWT válido
- Informe lista de produtos, quantidades, valor do frete, método de pagamento e dados do cartão se necessário
- 5% de desconto no valor total se pagar com cartão
- Resposta do checkout contém valor final

## Banco de dados
- Usuários e produtos em memória (veja arquivos em `src/models`)

## Testes
- Para testes automatizados, importe o `app` de `rest/app.js` ou `graphql/app.js` sem o método `listen()`

## Documentação
- Swagger disponível em `/api-docs`
- Playground GraphQL disponível em `/graphql`

## Conceitos do K6 Utilizados nos Testes

### Thresholds

O código abaixo está armazenado no arquivo `test/k6/trabalho_final` e demonstra o uso do conceito de **Thresholds**, onde são definidos os limites aceitáveis de desempenho e falha das requisições HTTP durante a execução do teste de carga.

```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(90)<=2', 'p(95)<=3'],
    http_req_failed: ['rate<0.01'],
  },
};
```

### Checks

O código abaixo está armazenado no arquivo `test/k6/trabalho_final` e demonstra o uso do conceito de **Checks**, que valida respostas das requisições, como status HTTP.

```javascript
check(responseRegister, {
  'status deve ser igual a 201 quando usuário registrado': (res) => res.status === 201
});
```

### Helpers

O código abaixo está armazenado nos arquivos `test/helpers/login.js`, `test/helpers/register.js` e `test/helpers/checkout.js` e demonstra o uso do conceito de **Helpers**, que são funções reutilizáveis para endpoints.

```javascript
import http from 'k6/http';
import { BASE_URL } from './baseURL.js';

export function login(email, password) {
  const payload = JSON.stringify({
    email,
    password
  });

  return http.post(`${BASE_URL}/api/users/login`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

### Trends

O código abaixo está armazenado no arquivo `test/k6/trabalho_final` e demonstra o uso do conceito de **Trends**, que são métricas customizadas utilizadas para acompanhar a duração das requisições HTTP em diferentes fluxos da aplicação.

```javascript
export const PostCheckOutDurationTrend = new Trend('PostCheckOutDurationTrend');
export const PostRegisterDurationTrend = new Trend('PostRegisterOutDurationTrend');
export const PostLoginDurationTrend = new Trend('PostLoginOutDurationTrend');

PostRegisterDurationTrend.add(responseRegister.timings.duration);
PostLoginDurationTrend.add(responseLogin.timings.duration);
PostCheckOutDurationTrend.add(responseCheckout.timings.duration);
```

### Faker

O código abaixo está armazenado no arquivo `test/k6/trabalho_final` e demonstra o uso da biblioteca **Faker**, utilizada para gerar dados aleatórios durante a execução dos testes, tornando os cenários mais dinâmicos e evitando o uso de dados fixos.

```javascript
let name = faker.person.firstName();
let password = faker.internet.password();
```

### Variável de Ambiente (Base URL)

O código abaixo está armazenado no arquivo `test/helpers/baseURL.js` e demonstra a definição da **Base URL** da aplicação, utilizada de forma centralizada nos helpers de requisição.

```javascript
export const BASE_URL = 'http://localhost:3000';
```

### Stages

O código abaixo está armazenado no arquivo `test/k6/trabalho_final` (linhas 29–35) e demonstra o uso do conceito de **Stages**, responsável por controlar a variação da carga ao longo do tempo, simulando o comportamento real dos usuários.

```javascript
stages: [
  { duration: '3s', target: 2 },
  { duration: '15s', target: 2 },
  { duration: '2s', target: 5 },
  { duration: '3s', target: 5 },
  { duration: '5s', target: 10 },
  { duration: '5s', target: 0 },
];
```

### Reaproveitamento de Resposta (Captura de Token)

O código abaixo está armazenado no arquivo `test/k6/trabalho_final` (linha 73) e demonstra o reaproveitamento de dados de uma resposta anterior, especificamente a captura do token de autenticação retornado no login.

```javascript
const token = responseLogin.json('token');
```

### Uso de Token de Autenticação

O código abaixo está armazenado no arquivo `test/helpers/checkout.js` (linha 25) e demonstra o uso do token JWT no header das requisições autenticadas.

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
};
```

### Data-Driven Testing

O código abaixo está armazenado no arquivo `test/k6/trabalho_final` (linhas 16–17) e demonstra o uso do conceito de **Data-Driven Testing**, onde os dados de entrada são carregados a partir de um arquivo externo em formato JSON.

```javascript
const users = new SharedArray('users', function () {
  return JSON.parse(open('../data/login.data.json'));
});
```

### Groups

O código abaixo está armazenado no arquivo `test/k6/trabalho_final` e demonstra o uso do conceito de **Groups**, utilizado para organizar o teste em blocos lógicos que representam diferentes fluxos da aplicação.

```javascript
group('Simulando cadastro de usuário', () => {
  // register
});

group('Fazendo login', () => {
  // login
});

group('Realizando checkout', () => {
  // checkout
});
```

### Relatórios
Para exibição de relatório em html utilize esse comando:
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html K6_WEB_DASHBOARD_PERIOD=2s k6 run ./test/k6/trabalho_final.k6.js
