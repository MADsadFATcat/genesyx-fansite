import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Minimized } from '../db/minimized.schema';

@Injectable()
export class MinimizedService {
  constructor(@InjectModel(Minimized.name) private readonly minimizedModel: Model<Minimized>) {
  }

  public async create(hash: string, data: string): Promise<Minimized> {
    const minimized = new this.minimizedModel();
    minimized.hash = hash;
    minimized.data = data;
    return minimized.save();
  }

  public async get(hash: string): Promise<Minimized> {
    return this.minimizedModel.findOne({ hash: hash });
  }
}
