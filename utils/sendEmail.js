import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("From:", process.env.NAME);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    await transporter.sendMail({
        from: `${process.env.NAME} <${process.env.EMAIL}>`,
        to,
        subject,
        html
    });

    console.log("Email sent successfully!");
}

export default sendEmail;