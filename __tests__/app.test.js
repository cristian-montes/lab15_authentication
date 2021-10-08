const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

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




  afterAll(() => {
    pool.end();
  });
});
