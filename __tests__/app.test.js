const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');

describe('lab15-authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  //IT POST NEW USERTS TO DATA BASE
  it('sgins up a new user via POST', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'alpastor@tacos.com', password:'corn-tortilla' });

    expect(res.body).toEqual(
      { id: expect.any(String),
        email: 'alpastor@tacos.com' });
  });


  //CHECKS FOR EXISTING EMAILS AND THROWS A 400, IF TRYING TO SIGNUP WITH .
  it('checks for 400 if user already exists', async () => {
    await UserService.create({ 
      email: 'alpastor@tacos.com', 
      password:'corn-tortilla' 
    });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'alpastor@tacos.com', password:'corn-tortilla' });
      
    expect(res.status).toEqual(400);
  
  });


  //SIGNS IN A USER 
  it('sign in a user via post', async () => {
    await UserService.create({ 
      email: 'alpastor@tacos.com', 
      password:'corn-tortilla' 
    });
    const res = await request(app)
      .post('/api/auth/sigin')
      .send({
        email: 'alpastor@tacos.com', 
        password:'corn-tortilla'
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'alpastor@tacos.com' }
    );
  });





  afterAll(() => {
    pool.end();
  });
});
