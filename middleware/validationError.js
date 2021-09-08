function ValidationError(message, status) {
    this.message = message;
    this.status = status;
    this.error = true;
    this.ok = false;
}

module.exports = ValidationError;
