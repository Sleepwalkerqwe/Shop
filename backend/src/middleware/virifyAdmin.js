export const verifyAdmin = (req, res, next) => {
  if (req.role !== "admin") return res.status(403).send({ success: false, nessage: "You are not authorized to perform this action" });
};
