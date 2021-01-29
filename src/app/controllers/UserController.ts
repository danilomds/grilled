import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

class UserController {
  index(req: Request, res: Response) {
    return res.send({ userId: req.userId });
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User);

    const { name, email, password } = req.body;

    const emailExists = await repository.findOne({ where: { email } });

    if (emailExists) {
      return res.status(409).send('Email already exists.');
    }

    const user = repository.create({ name, email, password });
    await repository.save(user);

    return res.json(user);
  }
}

export default new UserController();
