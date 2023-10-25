import MessageService from "../services/messages.service.js";

let messageService = new MessageService()

const getMessages = async (req, res) => {
  let messages = await messageService.getMessages()

  res.send(messages)
}

const addMessage = async (req, res) => {
  let newMessage = req.body

  await messageService.addMessage(newMessage)
  req.socketServer.emit("update-messages", await messageService.getMessages())

  res.send({status: "success"})
}

export default {
  getMessages,
  addMessage
}