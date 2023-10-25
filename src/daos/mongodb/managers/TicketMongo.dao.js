import { ticketsModel } from "../models/ticket.model.js";

export default class TicketManager {

  async createTicket(ticket) {
    let result = await ticketsModel.create(ticket)

    return result
  }
}