const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pastebin",
    version: "1.1",
    author: "BaYjid",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Upload command files to BaYjid Pastebin"
    },
    longDescription: {
      en: "Upload a command file from cmds folder to your custom BaYjid Pastebin and get a raw code link."
    },
    category: "Utility",
    guide: {
      en: "Usage: !pastebin <filename>\n(Note: File must be inside 'cmds' folder)"
    }
  },

  onStart: async ({ api, event, args }) => {
    const fileName = args[0];

    if (!fileName) {
      return api.sendMessage(
        "âš ï¸ Please provide a file name.\nExample: !pastebin bdresult",
        event.threadID
      );
    }

    const cmdsFolder = path.join(__dirname, "..", "cmds");
    const filePathRaw = path.join(cmdsFolder, fileName);
    const filePathJs = `${filePathRaw}.js`;

    const filePath = fs.existsSync(filePathRaw)
      ? filePathRaw
      : fs.existsSync(filePathJs)
      ? filePathJs
      : null;

    if (!filePath) {
      return api.sendMessage(
        `âŒ File *${fileName}* not found in cmds folder! Please check the filename and try again.`,
        event.threadID
      );
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf8");

      const res = await axios.post("https://bayjid-api-hub.onrender.com/x", {
        text: fileContent,
        title: fileName
      });

      const pasteId = res?.data?.id;

      if (!pasteId) {
        return api.sendMessage(
          "âŒ Upload failed: Server did not return a valid ID.",
          event.threadID
        );
      }

      const rawLink = `https://bayjid-api-hub.onrender.com/x/raw/${pasteId}`;

      const successMessage = [
        "âœ… Upload Successful-!",
        `ðŸ”— Here is your Pastebin link:`,
        `${rawLink}`,
        "",
       !"pakiuðŸ™ˆðŸ˜š"
      ].join("\n");

      api.sendMessage(successMessage, event.threadID);
    } catch (error) {
      console.error("âŒ Upload Error:", error);
      api.sendMessage(
        `âŒ Error uploading to BaYjid server:\n${error.message}`,
        event.threadID
      );
    }
  }
};