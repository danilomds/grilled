import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';

interface DeleteUserProperties {
  name?: string;
  email: string;
  password?: string;
}

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User);

    const { email, password } = req.body;

    const users = await repository.findOne({ where: { email } });

    if (!users) {
      return res.status(401).send('Invalid email.');
    }

    const isValidPassword = await bcrypt.compare(password, users.password);

    if (!isValidPassword) {
      return res.status(401).send('Invalid password.');
    }

    const token = jwt.sign({ id: users.id }, 'secret', { expiresIn: '1d' });

    const user: DeleteUserProperties = users;
    delete user.name;
    delete user.password;

    return res.json({
      user,
      token,
    });
  }
}

export default new AuthController();
