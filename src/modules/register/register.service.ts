import { getConnection } from 'typeorm';
import HttpException from '../../common/exceptions/HttpException';
import { mailInstance } from '../../common/mail/mail';
import { FRONT_URL } from '../../common/constants/dotenv';
import IUserTokens from '../../common/interfaces/user.tokens.interface';
import UserService from '../user/user.service';
import User from '../../entities/user.entity';
import Confirmation from '../../entities/confirmation.entity';
import Session from '../../entities/session.entity';
import ConfirmationEmailDTO from './dto/confirmation.email.dto';
import {BAD_REQUEST, NOT_FOUND} from 'http-status-codes';

export default class RegisterService {
  private userRepo;
  private confirmationRepo;
  private sessionRepo;
  private userService;
  constructor() {
    this.userRepo = getConnection().getRepository(User);
    this.confirmationRepo = getConnection().getRepository(Confirmation);
    this.sessionRepo = getConnection().getRepository(Session);
    this.userService = new UserService();
  }

  public async addUser(req): Promise<IUserTokens> {
    const { email, password, firstName, lastName } = req.body;
    const existedUser = await this.userRepo.findOne({email});
    if (existedUser) {
      throw new HttpException('User already exist', BAD_REQUEST);
    } else {
        let user = await this.userRepo.createAndSave({ password, email, firstName, lastName });
        const emailCode = this.sendEmailConfirmation(user);
        await this.confirmationRepo.createAndSave({ emailCode,  userId: user.id });

        const tokens = await this.userService.createNewSession(user, req.headers, req.connection);
        user = await this.userService.getUser(user.id);
        user.tokens = tokens;
        return user;
    }
  }

  public async confirmUserEmail(data: ConfirmationEmailDTO, id): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.confirmation', 'confirmation')
      .addSelect(['confirmation.emailCode', 'confirmation.isEmailConfirmed', 'confirmation.userId'])
      .where('user.id = :id', {id})
      .getOne();
    if (user) {
      if (user.confirmation.isEmailConfirmed) {
        throw new HttpException('Email is already confirmed', BAD_REQUEST);
      } else if (user.confirmation.emailCode === data.code) {
        user.confirmation.isEmailConfirmed = true;
        await this.confirmationRepo.save(user.confirmation);
        delete user.confirmation.emailCode;
        return user;
      } else  {
        throw new HttpException('Code does not match', BAD_REQUEST);
      }
    } else { throw new HttpException('User does not exist', NOT_FOUND); }
  }

  sendEmailConfirmation(user: User): number {
    const code = Math.floor(Math.random() * (9999 - 1000) + 1000);
    mailInstance.sendMail({
      from: '"Vasyl Mysiura 👻" <foo@example.com>',
      to: user.email,
      subject: `Hello, ${user.firstName} ✔`,
      text: 'Great! You can send test emails!)',
      html: `<div>
      		<p>${user.firstName} ${user.lastName},  Great! You can send test emails!)</p>
      		<p>For confirmation your email enter the link
      			<a href="${FRONT_URL}/${user.id}/?${code}">Continue registration</a>
      			or enter code <b>${code}</b>
      	</div>
      	`,
    });
    return code;
  }
}
