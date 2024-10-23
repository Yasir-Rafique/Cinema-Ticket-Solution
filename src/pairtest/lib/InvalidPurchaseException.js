class InvalidPurchaseException extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidPurchaseException";
  }
}
module.exports = InvalidPurchaseException;
