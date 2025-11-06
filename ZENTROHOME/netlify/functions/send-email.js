const nodemailer = require("nodemailer");

exports.handler = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // prueba enviándotelo a ti mismo
      subject: "Prueba desde Netlify 🚀",
      text: "Si lees este correo, ¡funciona!",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Correo enviado" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
