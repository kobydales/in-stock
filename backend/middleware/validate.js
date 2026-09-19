// Wraps a zod schema as Express middleware. On failure it returns a 400
// with a flat map of field -> message, matching the { error } shape your
// frontend api.js already expects (errorData.error).
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstField = Object.keys(fieldErrors)[0]
      const firstMessage = firstField ? fieldErrors[firstField][0] : 'Invalid input'

      return res.status(400).json({
        error: firstMessage,
        fields: fieldErrors,
      })
    }

    // Replace req.body with the parsed/coerced data so downstream code
    // gets trimmed strings, numbers as numbers, etc.
    req.body = result.data
    next()
  }
}

module.exports = { validate }

