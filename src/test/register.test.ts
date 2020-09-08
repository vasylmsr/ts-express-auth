import * as request from 'supertest';
import server from '../server';
import User from '../entities/user.entity';
import {getConnection, getRepository} from 'typeorm';
import HttpException from '../common/exceptions/HttpException';
import RegisterService from '../modules/register/register.service';
import {BAD_REQUEST} from 'http-status-codes';
let app;
let registerService;
beforeAll(async () => {
  const a = await server();
  await getConnection().getRepository(User)
    .createQueryBuilder()
    .delete()
    .from(User)
    .execute();
  app = a.listen();
  registerService  = new RegisterService();
  registerService.sendEmailConfirmation =  jest.fn().mockReturnValue(1111);
});

describe('Music dream', () => {
  const user = {
    email: 'vddx@xdjslнr.com',
    password: '11112222Qq',
    firstName: 'Peter',
    lastName: 'Parker',
  };
  it('POST /registration ', (done) => {
    return request(app).post('/registration').send(user).expect(201).then(response => {
      expect(response.body.user.email).toBe(user.email);
      done();
    });
  });
  it('POST /registration validation error', (done) => {
    return request(app).post('/registration').send({...user, email: 1111}).expect(400, done);
  });

  // test('ss',  async (done) => {
  //   return expect( await registerService.addUser({body: {...user}})).rejects.toEqual(
  //     new HttpException( 'User already exist', BAD_REQUEST),
  //   );
  // });
});
