// Centralizes how unexpected (non-validated) errors are returned to
// clients. The FULL error is logged server-side for debugging, but the
// client only ever gets a generic message — raw Postgres errors can
// mention real column/table names, which we don't want to expose.
function sendServerError(res, err, context) {
  console.error(context ? `[${context}]` : '[Unhandled error]', err)
  res.status(500).json({ error: 'Something went wrong on our end. Please try again.' })
}

module.exports = { sendServerError }
