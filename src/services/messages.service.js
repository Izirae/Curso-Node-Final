import MessageManager from "../daos/mongodb/managers/MessageMongo.dao.js";

export default class MessageService {

  constructor() {
    this.messageDao = new MessageManager()
  }

  async getMessages() {
    let messages = await this.messageDao.getMessages()
  
    return messages
  }
  
  async addMessage(newMessage) {
    await this.messageDao.addMessage(newMessage)
  }

}