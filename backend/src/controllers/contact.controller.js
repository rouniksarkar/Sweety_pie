import { Contact } from "../models/contact.model.js";

export const createContactQuery = async (req, res) => {
  const { name, email, message } = req.body;

  if (![name, email, message].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: normalizedEmail,
    message: message.trim(),
  });

  res.status(201).json({ success: true, message: "Your message has been sent successfully.", contact });
};

export const getContactQueries = async (_req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, contacts });
};
