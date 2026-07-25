const fetch = require('node-fetch');
const busboy = require('busboy');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Hide Bot Token & Chat ID in Serverless Function
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8614700033:AAGL-5j9XCgVkhgKG_L4laptfHw6ni2K28A";
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-5387442396";

  return new Promise((resolve, reject) => {
    try {
      const bb = busboy({ headers: event.headers });
      const fields = {};
      let photoFile = null;
      let photoFileName = '';
      let photoMimeType = '';
      const photoChunks = [];

      bb.on('field', (fieldname, val) => {
        fields[fieldname] = val;
      });

      bb.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        photoFileName = filename;
        photoMimeType = mimeType;
        file.on('data', (data) => photoChunks.push(data));
        file.on('end', () => {
          photoFile = Buffer.concat(photoChunks);
        });
      });

      bb.on('finish', async () => {
        const name = fields.name || 'Anonymous';
        const phone = fields.phone || 'N/A';
        const service = fields.service || 'General Inquiry';
        const message = fields.message || '';

        const cleanPhone = phone.replace(/\D/g, '');
        const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
        const waDirectLink = `https://api.whatsapp.com/send?phone=${formattedPhone}`;
        const callDirectLink = `tel:+91${cleanPhone.length === 10 ? cleanPhone : phone}`;

        const now = new Date();
        const timeString = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

        function escapeHTML(str) {
          return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        let captionHTML = `🛠️ <b>NEW FIXOWE SERVICE BOOKING</b> 🛠️\n`;
        captionHTML += `━━━━━━━━━━━━━━━━━━━━\n`;
        captionHTML += `👤 <b>Customer Name:</b> ${escapeHTML(name)}\n`;
        captionHTML += `📞 <b>Phone Number:</b> ${escapeHTML(phone)}\n`;
        captionHTML += `🔧 <b>Service Requested:</b> ${escapeHTML(service)}\n`;
        if (message) {
          captionHTML += `📝 <b>Customer Note:</b> <i>"${escapeHTML(message)}"</i>\n`;
        }
        captionHTML += `🕒 <b>Time Received:</b> ${timeString}\n`;
        captionHTML += `⚡ <b>Status:</b> 🟢 <b>New Unassigned Lead</b>\n`;
        captionHTML += `━━━━━━━━━━━━━━━━━━━━`;

        const inlineKeyboard = {
          inline_keyboard: [
            [
              { text: "💬 Chat with Customer on WhatsApp", url: waDirectLink }
            ]
          ]
        };

        if (photoFile && photoFile.length > 0) {
          const FormData = require('form-data');
          const formData = new FormData();
          formData.append('chat_id', TELEGRAM_CHAT_ID);
          formData.append('photo', photoFile, { filename: photoFileName || 'photo.jpg', contentType: photoMimeType || 'image/jpeg' });
          formData.append('caption', captionHTML);
          formData.append('parse_mode', 'HTML');
          formData.append('reply_markup', JSON.stringify(inlineKeyboard));

          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
          });
        } else {
          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: captionHTML,
              parse_mode: 'HTML',
              reply_markup: inlineKeyboard
            })
          });
        }

        resolve({
          statusCode: 200,
          body: JSON.stringify({ success: true, message: 'Booking processed privately.' })
        });
      });

      if (event.isBase64Encoded) {
        bb.write(Buffer.from(event.body, 'base64'));
      } else {
        bb.write(event.body);
      }
      bb.end();
    } catch (err) {
      console.error('Serverless Function error:', err);
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      });
    }
  });
};
