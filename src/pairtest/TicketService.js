const TicketTypeRequest = require("./lib/TicketTypeRequest.js");
const InvalidPurchaseException = require("./lib/InvalidPurchaseException.js");
const TicketPaymentService = require("../thirdparty/paymentgateway/TicketPaymentService.js");
const SeatReservationService = require("../thirdparty/seatbooking/SeatReservationService.js");

class TicketService {
  /**
   * Main method for purchasing tickets.
   * @param {number} accountId - The account ID making the purchase
   * @param {...TicketTypeRequest} ticketTypeRequests - The ticket requests
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account ID");
    }

    const ticketCounts = this.#countTickets(ticketTypeRequests);
    this.#validateTicketCounts(ticketCounts);

    const totalCost = this.#calculateTotalCost(ticketCounts);
    const totalSeats = this.#calculateTotalSeats(ticketCounts);

    this.#makePayment(accountId, totalCost);
    this.#reserveSeats(accountId, totalSeats);
  }

  /**
   * Counts the number of each type of ticket.
   * @param {Array} ticketTypeRequests - Array of TicketTypeRequest objects
   * @returns {Object} - An object with counts for each ticket type
   */
  #countTickets(ticketTypeRequests) {
    const counts = { ADULT: 0, CHILD: 0, INFANT: 0 };

    for (const request of ticketTypeRequests) {
      const type = request.getTicketType();
      const noOfTickets = request.getNoOfTickets();
      counts[type] += noOfTickets;
    }

    return counts;
  }

  /**
   * Validates the ticket counts based on business rules.
   * @param {Object} counts - An object with ticket counts
   */
  #validateTicketCounts(counts) {
    const { ADULT, CHILD, INFANT } = counts;

    if (ADULT === 0 && (CHILD > 0 || INFANT > 0)) {
      throw new InvalidPurchaseException(
        "At least one Adult ticket is required when purchasing Child or Infant tickets"
      );
    }

    if (INFANT > ADULT) {
      throw new InvalidPurchaseException(
        "Cannot have more infants than adults"
      );
    }

    const totalTickets = ADULT + CHILD + INFANT;
    if (totalTickets > 25) {
      throw new InvalidPurchaseException(
        "Cannot purchase more than 25 tickets at a time"
      );
    }
  }

  /**
   * Calculates the total cost based on ticket counts.
   * @param {Object} counts - An object with ticket counts
   * @returns {number} - The total cost
   */
  #calculateTotalCost(counts) {
    const { ADULT, CHILD } = counts;
    return ADULT * 25 + CHILD * 15;
  }

  /**
   * Calculates the total number of seats needed.
   * @param {Object} counts - An object with ticket counts
   * @returns {number} - The total number of seats
   */
  #calculateTotalSeats(counts) {
    const { ADULT, CHILD } = counts;
    return ADULT + CHILD;
  }

  /**
   * Makes the payment using the TicketPaymentService.
   * @param {number} accountId - The account ID making the purchase
   * @param {number} amount - The total amount to be paid
   */
  #makePayment(accountId, amount) {
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, amount);
  }

  /**
   * Reserves the seats using the SeatReservationService.
   * @param {number} accountId - The account ID making the reservation
   * @param {number} seats - The total number of seats to reserve
   */
  #reserveSeats(accountId, seats) {
    const reservationService = new SeatReservationService();
    reservationService.reserveSeat(accountId, seats);
  }
}

module.exports = TicketService;
