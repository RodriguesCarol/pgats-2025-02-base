import http from 'k6/http';
import { BASE_URL } from './baseURL.js';

export function register(name, email, password) {
    const payload = JSON.stringify({
        name,
        email,
        password
    });

    return http.post(`${BASE_URL}/api/users/register`, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}