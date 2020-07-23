import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from '../db/conversation.schema';

@Injectable()
export class ConversationService {
  constructor(@InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>) {
  }

  public async getAll(): Promise<Conversation[]> {
    return this.conversationModel.find({});
  }

  public async createIfNotExists(chatId: string, name: string): Promise<Conversation> {

    if (await this.conversationModel.exists({ chatId: chatId }))
      return;

    const conversation = new this.conversationModel();
    conversation.chatId = chatId;
    conversation.name = name;
    return conversation.save();
  }

  public async delete(id: string): Promise<any> {
    return this.conversationModel.deleteOne({ _id: id });
  }
}
