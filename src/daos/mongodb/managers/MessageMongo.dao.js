import { messageModel } from "../models/messages.model.js";

export default class MessageManager {
  
  async getMessages() {
    let result = await messageModel.find({})
    return result
  }

  async addMessage(message) {
    let result = await messageModel.create(message)
    return result
  }

}