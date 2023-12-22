'use strict';
import express, { Express, Request, Response } from 'express';
import supertest from 'supertest';
import { AuthRequest, Kunji } from '../src/index';
import { expect } from 'chai';

// test application configuration
const appId = 'test';
const publicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0QH5YHC2ZmW1w5JYuWeE\nYGFU4iXjbDP3HHKO9EiRjWQMiMErHALaHV9WKkgimEMdDmIfPNc6kVgTYTuTTgAa\nPL9cdNjJ3qQuPFSR6fx3DL5GUBee99fMQJE0jYhkwO5eyquUMGd1ACss/5bWD1g8\nP/saM+Y3BQp2lXse/Z2rsYrgVO1r52iYrqNfkzInj3iS1VrRbIBBnpncSWJPwWap\nRdrgZhkitpFOc/jc+wsBZuMKPab7f9o4S8BOJVmO7pG+qY8Bk1kC4OiYyADpErLs\n3kOAZZo9IllQJMFZ3C4w7aeTmlZZRchgFhbulHewz7cmN6MtNG6FRE58n9KDFdhY\nyQIDAQAB\n-----END PUBLIC KEY-----';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NTdhZDk3N2VkMGVlNjg0MDMzMWNhYjQiLCJyb2xlIjoiTk9STUFMIiwiaWF0IjoxNzAzMTM3NDA2LCJleHAiOjE3MDMxNDEwMDZ9.OCupyvYlAET6EdrviCOHivAZFJNEtdraBpCLu8QM74s';
// This Token has no expiry set for testing purposes
const validToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NTdhZDk3N2VkMGVlNjg0MDMzMWNhYjQiLCJyb2xlIjoiQURNSU4iLCJpc3MiOiJrdW5qaS10ZXN0LWlzc3VlciIsImF1ZCI6InRlc3QiLCJpYXQiOjE3MDMxNDQ0OTR9.nhZxvYVeLGpGqds_IYC-2NuCQpwEfITSHPPOqCBVQAS718QhDPNB5Ps4fXVNkol_2qU64IJdZnPJAYNWVVIz2preyu5TwrwiwJGWglcMGVF-VOC8hlTqbE8sbQd-AGTYV9aVCxZEV__4Ffhfkd74lqYHxH0HA_G6SgSkcnWKWijcptIt0zAc8nqntbfFpdEMR64tTBErVopWWq9xLlG4EB_1ZecIRJ0Sz0gEc4THeW0vR4NJUHR-dWCKE2mMbLLLk20kMMalcjCTd-GII34rLeW_5rkqu3XLvBSOdiK0J_cdkEWIrmTbCvozW8Y_KosjuiCIqZHH-CeJDEKV_H1rmg';

const { AuthMiddleware: authMiddleware } = Kunji(appId, publicKey);

describe('Express Authentication Middleware', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json()); // Make sure to parse JSON in request bodies
    app.use(authMiddleware); // Use the authentication middleware for all routes
  });

  it('should pass through authenticated requests', (done) => {
    // Set up a route that requires authentication
    app.get('/authenticated-route', (req: Request, res: Response) => {
      res.sendStatus(200);
    });

    supertest(app)
      .get('/authenticated-route')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200, done);
  });

  it('should have req.user after successful authenticated request', (done) => {
    // Set up a route that requires authentication
    app.get('/authenticated-route', (req: AuthRequest, res: Response) => {
      try {
        expect(req.user?.uid).to.exist;
        expect(req.user?.uid).to.be.a.string;
        res.sendStatus(200);
      } catch (error) {
        done(error)
      }
    });

    supertest(app)
      .get('/authenticated-route')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200, done);
  });

  it('should reject unauthenticated requests with a 401 status', (done) => {
    // Set up a route that requires authentication
    app.get('/authenticated-route', (req: Request, res: Response) => {
      res.sendStatus(200);
    });

    supertest(app).get('/authenticated-route').expect(401, done);
  });

  it('should reject requests with invalid tokens with a 401 status', (done) => {

    // Set up a route that requires authentication
    app.get('/authenticated-route', (req: Request, res: Response) => {
      res.sendStatus(200);
    });

    supertest(app)
      .get('/authenticated-route')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401, done);
  });
});