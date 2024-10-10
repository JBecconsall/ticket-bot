const ticket = require('../schemas/ticketSchema');

const addTicket = async (id, opened) => {
    const query = new ticket({id: id, opened: opened})
    await query.save();

    return query;
}

module.exports = {
    addTicket
}