const express = require("express");
const { Message } = require("../../models");

const router = express.Router();

// get messages
router
  .route("/messages")
  .get(async (req, res) => {
    try {
      const messages = await Message.find();
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(async (req, res) => {
    try {
      const { user, message } = req.body;

      if (!user || !message) {
        return res.status(400).json({ error: "User and message are required" });
      }

      const chatMessage = new Message({
        user,
        message,
      });

      await chatMessage.save();

      res.status(201).json(chatMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
