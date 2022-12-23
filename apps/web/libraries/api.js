import axios from 'axios';
import Router from 'next/router';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
