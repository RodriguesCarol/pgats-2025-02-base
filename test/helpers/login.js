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