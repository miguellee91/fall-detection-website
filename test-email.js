
const nodemailer = require('nodemailer');

async function testEmailWithMailtrap() {
    try {
        // IMPORTANT: Replace with your actual Mailtrap credentials
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io", // This is Mailtrap's host
            port: 2525, // Use the port provided by Mailtrap
            auth: {
                user: "YOUR_MAILTRAP_USERNAME", // Replace with your Mailtrap username
                pass: "YOUR_MAILTRAP_PASSWORD"  // Replace with your Mailtrap password
            }
        });

        console.log('Sending a test email to Mailtrap...');
        let info = await transporter.sendMail({
            from: '"CleverGuard Test" <noreply@cleverguard.com>',
            to: 'miguel_lee@atman-ai.kr', // This will be trapped by Mailtrap
            subject: 'Mailtrap Test from CleverGuard Website',
            text: 'This email was successfully sent from the website script and captured by Mailtrap.',
            html: '<b>This email was successfully sent from the website script and captured by Mailtrap.</b>'
        });

        console.log('Test email sent successfully to Mailtrap!');
        console.log('Message sent: %s', info.messageId);
        console.log("Please check your Mailtrap inbox to see the email.");

    } catch (error) {
        console.error('Failed to send test email to Mailtrap:', error);
    }
}

testEmailWithMailtrap();
