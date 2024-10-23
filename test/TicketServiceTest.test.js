const TicketService = require("../src/pairtest/TicketService.js");
const TicketTypeRequest = require("../src/pairtest/lib/TicketTypeRequest.js");
const InvalidPurchaseException = require("../src/pairtest/lib/InvalidPurchaseException.js");

describe("TicketService", () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  // Test Case 1: Valid Purchase - Single Adult Ticket
  test("should process valid purchase of a single adult ticket", () => {
    expect(() => {
      ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1));
    }).not.toThrow();
  });

  // Test Case 2: Valid Purchase - Multiple Adult and Child Tickets
  test("should process valid purchase of multiple adult and child tickets", () => {
    expect(() => {
      ticketService.purchaseTickets(
        2,
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 2)
      );
    }).not.toThrow();
  });

  // Test Case 3: Valid Purchase - Adults, Children, and Infants
  test("should process valid purchase of adults, children, and infants", () => {
    expect(() => {
      ticketService.purchaseTickets(
        3,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 2),
        new TicketTypeRequest("INFANT", 1)
      );
    }).not.toThrow();
  });

  // Test Case 4: Invalid Purchase - No Adult with Child Ticket
  test("should throw exception when no adult ticket is present with a child ticket", () => {
    expect(() => {
      ticketService.purchaseTickets(4, new TicketTypeRequest("CHILD", 2));
    }).toThrow(InvalidPurchaseException);
  });

  // Test Case 5: Invalid Purchase - No Adult with Infant Ticket
  test("should throw exception when no adult ticket is present with an infant ticket", () => {
    expect(() => {
      ticketService.purchaseTickets(5, new TicketTypeRequest("INFANT", 1));
    }).toThrow(InvalidPurchaseException);
  });

  // Test Case 6: Invalid Purchase - Exceed Maximum Ticket Limit
  test("should throw exception when purchasing more than 25 tickets", () => {
    expect(() => {
      ticketService.purchaseTickets(6, new TicketTypeRequest("ADULT", 26));
    }).toThrow(InvalidPurchaseException);
  });

  // Test Case 7: Valid Purchase - Maximum Ticket Limit (25 tickets)
  test("should process valid purchase of the maximum ticket limit (25 tickets)", () => {
    expect(() => {
      ticketService.purchaseTickets(
        7,
        new TicketTypeRequest("ADULT", 10),
        new TicketTypeRequest("CHILD", 10),
        new TicketTypeRequest("INFANT", 5)
      );
    }).not.toThrow();
  });

  // Test Case 8: Invalid Purchase - Account ID is Zero
  test("should throw exception when account ID is zero", () => {
    expect(() => {
      ticketService.purchaseTickets(0, new TicketTypeRequest("ADULT", 1));
    }).toThrow(InvalidPurchaseException);
  });

  // Test Case 9: Invalid Purchase - Account ID is Negative
  test("should throw exception when account ID is negative", () => {
    expect(() => {
      ticketService.purchaseTickets(-1, new TicketTypeRequest("ADULT", 1));
    }).toThrow(InvalidPurchaseException);
  });

  // Test Case 10: Invalid Purchase - Invalid Ticket Type
  test("should throw exception when ticket type is invalid", () => {
    expect(() => {
      ticketService.purchaseTickets(10, new TicketTypeRequest("SENIOR", 1));
    }).toThrow(TypeError);
  });

  // Test Case 11: Invalid Purchase - Negative Number of Tickets
  test("should throw exception when number of tickets is negative", () => {
    expect(() => {
      ticketService.purchaseTickets(11, new TicketTypeRequest("ADULT", -1));
    }).toThrow(TypeError);
  });

  // Test Case 12: Valid Purchase - Multiple Ticket Types Without Hitting the Limit
  test("should process valid purchase with a variety of ticket types within limits", () => {
    expect(() => {
      ticketService.purchaseTickets(
        12,
        new TicketTypeRequest("ADULT", 5),
        new TicketTypeRequest("CHILD", 5),
        new TicketTypeRequest("INFANT", 5)
      );
    }).not.toThrow();
  });

  // Test Case 13: Invalid Purchase - More Infants Than Adults
  test("should throw exception when there are more infants than adults", () => {
    expect(() => {
      ticketService.purchaseTickets(
        13,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 2)
      );
    }).toThrow(InvalidPurchaseException);
  });
});
