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
  it('cheks for wrong password credential when signin', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send(standardUser);

    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'alpastor@tacos.com', password:'bread', role:'CUSTOMER' });
      
    expect(res.status).toEqual(401);

  });

  //CHECKS FOR INCORRECT EMAIL CREDENTIALS WHEN SIGININ
  it('cheks for wrong email credential when signin', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send(standardUser);

  
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'pollo@tacos.com', password:'corn-tortilla', role:'CUSTOMER' });
   
    expect(res.status).toEqual(401);
  
  });


  //GETS THE INFORMATION OF THE CURRENTLY USER SIGNED IN
  it('gets the information of the user signin', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send(standardUser);

    const agent = request.agent(app);

    await agent.post('/api/auth/signin').send(standardUser);

    const res = await agent.get('/api/auth/me');
    expect(res.body).toEqual({
      id: expect.any(String),
      email:'alpastor@tacos.com',
      role:'CUSTOMER',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });

  });


  //ONLY TO SIGN ADMINS
  it('allows ADMINS to update customers role', async () => {
    await UserService.create({
      email: 'administrador@gmail.com',
      password: '1234',
      roleTitle: 'ADMIN',
    });

    await UserService.create({
      email: 'normalbird@gmail.com',
      password: '1234',
      roleTitle: 'CUSTOMER',
    });


    const agent = request.agent(app);

    await agent.post('/api/auth/signin').send({
      email: 'administrador@gmail.com',
      password: '1234',
      roleTitle: 'ADMIN',
    });
   

    const res = await agent.put('/api/auth/upgrade/2')
      .send({ 
        email: 'normalbird@gmail.com',
        role: 'ADMIN' 
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'normalbird@gmail.com',
      role: 'ADMIN'
    });

  });

  //ONLY TO SIGN ADMINS
  it('trows an error is a non ADMINS trys to update customers role', async () => {
    await UserService.create({
      email: 'administrador@gmail.com',
      password: '1234',
      roleTitle: 'ADMIN',
    });

    await UserService.create({
      email: 'normalbird@gmail.com',
      password: '1234',
      roleTitle: 'CUSTOMER',
    });


    const agent = request.agent(app);

    await agent.post('/api/auth/signin').send({
      email: 'normalbird@gmail.com',
      password: '1234',
      roleTitle: 'CUSTOMER',
    });
   

    const res = await agent.put('/api/auth/upgrade/2')
      .send({ 
        email: 'normalbird@gmail.com',
        role: 'ADMIN' 
      });

    expect(res.body).toEqual({
      message: 'Unauthorized',
      status: 403,
    });

  });




  afterAll(() => {
    pool.end();
  });
});
