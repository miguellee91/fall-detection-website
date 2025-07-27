const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

console.log('SendGrid API Key loaded:', process.env.SENDGRID_API_KEY ? 'Yes' : 'No');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a transporter object using SendGrid's SMTP
let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'apikey', // SendGrid username is 'apikey'
        pass: process.env.SENDGRID_API_KEY, // Your SendGrid API Key from .env
    },
});

// Handle form submissions
app.post('/submit-form', async (req, res) => {
    const formData = req.body;
    console.log('Form data received:', formData);

    // Email content
    const mailOptions = {
        from: `"CleverGuard 문의" <${process.env.SENDER_EMAIL}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: `[CleverGuard] ${formData.hospital_name}의 상담 신청입니다.`,
        html: `
            <h2>CleverGuard 솔루션 상담 신청</h2>
            <p>새로운 상담 신청이 접수되었습니다.</p>
            <ul>
                <li><strong>병원명:</strong> ${formData.hospital_name}</li>
                <li><strong>담당자명:</strong> ${formData.contact_person}</li>
                <li><strong>이메일:</strong> ${formData.email}</li>
                <li><strong>연락처:</strong> ${formData.phone}</li>
            </ul>
            <hr>
            <h3>문의 내용:</h3>
            <p>${formData.message}</p>
        `
    };

    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);

        res.json({ 
            status: 'success',
            message: `'${formData.hospital_name}'으로 상담 신청이 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.` 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            status: 'error',
            message: '이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
