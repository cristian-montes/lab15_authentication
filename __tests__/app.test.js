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
      .post('/api/auth/signin')
      .send({
        email: 'alpastor@tacos.com', 
        password:'corn-tortilla'
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'alpastor@tacos.com' }
    );
  });

  //CHECKS FOR INCORRECT PASSWORD CREDENTIALS WHEN SIGININ
  it('cheks for wrong password credential when signin', async () => {
    await UserService.create({ 
      email: 'alpastor@tacos.com', 
      password:'corn-tortilla' 
    });

    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'alpastor@tacos.com', password:'bread' });
      
    expect(res.status).toEqual(401);

  });

  //CHECKS FOR INCORRECT EMAIL CREDENTIALS WHEN SIGININ
  it('cheks for wrong email credential when signin', async () => {
    await UserService.create({ 
      email: 'alpastor@tacos.com', 
      password:'corn-tortilla' 
    });
  
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'pollo@tacos.com', password:'corn-tortilla' });
        
    expect(res.status).toEqual(401);
  
  });







  afterAll(() => {
    pool.end();
  });
});
