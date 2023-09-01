export const validateBlogInput = (req, res, next) => {
  const { title, content } = req.body;

  // Check if title and content are present in the request body
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  // Check if title and content are of the correct type
  if (typeof title !== "string" || typeof content !== "string") {
    return res.status(400).json({ error: "Title and content must be strings" });
  }

  // Check if title and content are within the allowed length
  if (title.length > 100 || content.length > 1000) {
    return res.status(400).json({ error: "Title or content is too long" });
  }

  next();
};
