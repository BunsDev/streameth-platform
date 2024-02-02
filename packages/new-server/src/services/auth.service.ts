import BaseController from '@databases/storage';
import { IUser } from '@interfaces/user.interface';
import { IAuth } from '@interfaces/auth.interface';
import User from '@models/user.model';
import { HttpException } from '@exceptions/HttpException';
import jwt from 'jsonwebtoken';
import { config } from '@config';
const { SiweMessage, generateNonce } = require('siwe');

export default class AuthService {
  private path: string;
  private controller: BaseController<IUser>;
  constructor() {
    this.path = 'users';
    this.controller = new BaseController<IUser>('db', User);
  }

  async login(data: IUser): Promise<{ user: IUser; token: string }> {
    let existingUser = await this.controller.store.findOne({
      walletAddress: data.walletAddress,
    });
    if (existingUser) {
      await this.verifyMessage(data.signature, data.message, data.nonce);
    }
    if (!existingUser) {
      existingUser = await this.controller.store.create('', data, this.path);
    }
    let token = jwt.sign(
      { id: existingUser.walletAddress },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiry,
      },
    );
    return { user: existingUser, token };
  }

  generateNonce(): { nonce: string } {
    return { nonce: generateNonce() };
  }

  async verifyToken(data: IAuth): Promise<boolean> {
    try {
      jwt.verify(data.token, config.jwt.secret);
      return true;
    } catch (e) {
      if (
        e instanceof jwt.TokenExpiredError ||
        e instanceof jwt.JsonWebTokenError
      ) {
        return false;
      }
      return false;
    }
  }

  async verifyMessage(
    signature: string,
    message: string,
    nonce: string,
  ): Promise<boolean> {
    let siwe = new SiweMessage(message);
    const signedMessage = await siwe.verify({
      signature: signature,
      nonce: nonce,
    });
    if (!signedMessage.success)
      throw new HttpException(400, 'Verification failed');
    return signedMessage.success;
  }
}
