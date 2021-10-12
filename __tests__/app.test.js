const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');


const standardUser = {
  email: 'alpastor@tacos.com',
  password:'corn-tortilla', 
  role: 'CUSTOMER'
};



describe('lab15-authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  //IT POST NEW USERTS TO DATA BASE
  it('sgins up a new user via POST', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(standardUser);

    expect(res.body).toEqual(
      { id: expect.any(String),
        email: 'alpastor@tacos.com',
        role: 'CUSTOMER' 
      });
  });

  //CHECKS FOR EXISTING EMAILS AND THROWS A 400, IF TRYING TO SIGNUP WITH .
  it('checks for 400 if user already exists', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send(standardUser);
   

    const res = await request(app)
      .post('/api/auth/signup')
      .send(standardUser);
    expect(res.status).toEqual(400);
  
  });


  
  //SIGNS IN A USER 
  it('sign in a user via post', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send(standardUser);

    const res = await request(app)
      .post('/api/auth/signin')
      .send(standardUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'alpastor@tacos.com',
      role: 'CUSTOMER' 
    });
  });

  //CHECKS FOR INCORRECT PASSWORD CREDENTIALS WHEN SIGININ
  xit('cheks for wrong password credential when signin', async () => {
    await UserService.create({ 
      email: 'alpastor@tacos.com', 
      password:'corn-tortilla',
      role: 'CUSTOMER'
    });

    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'alpastor@tacos.com', password:'bread',  });
      
    expect(res.status).toEqual(401);

  });

  //CHECKS FOR INCORRECT EMAIL CREDENTIALS WHEN SIGININ
  xit('cheks for wrong email credential when signin', async () => {
    await UserService.create({ 
      email: 'alpastor@tacos.com', 
      password:'corn-tortilla' 
    });
  
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'pollo@tacos.com', password:'corn-tortilla' });
        
    expect(res.status).toEqual(401);
  
  });

  //GETS THE INFORMATION OF THE CURRENTLY USER SIGNED IN
  xit('gets the information of the user signin', async () => {
    await UserService.create({ 
      email: 'alpastor@tacos.com', 
      password:'corn-tortilla' 
    });

    const agent = request.agent(app);

    await agent.post('/api/auth/signin')
      .send({
        email: 'alpastor@tacos.com', 
        password:'corn-tortilla'
      });

    const res = await agent.get('/api/auth/me');
    expect(res.body).toEqual({
      id: expect.any(String),
      email:'alpastor@tacos.com'
    });

  });



  afterAll(() => {
    pool.end();
  });
});
