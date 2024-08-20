const request = require('supertest');
const express = require('express');
const { MongoClient } = require('mongodb');
const app = require ('../Server/server');

describe('GET /api/tasks', () => {
    it('should return a list of tasks', async () => {
        const response = await request(app).get('/api/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});