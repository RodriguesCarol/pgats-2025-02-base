import http from 'k6/http';
import { BASE_URL } from './baseURL.js';

export function checkout(token) {
    const payload = JSON.stringify({
        items: [
            {
                productId: 1,
                quantity: 1
            }
        ],
        freight: 0,
        paymentMethod: "boleto",
        cardData: {
            number: "string",
            name: "string",
            expiry: "string",
            cvv: "string"
        }
    });

    return http.post(`${BASE_URL}/api/checkout`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}