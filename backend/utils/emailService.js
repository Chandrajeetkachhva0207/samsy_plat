const nodemailer = require("nodemailer");

/**
 * Send Password Reset OTP email
 * Supports Gmail app password via GMAIL_USER & GMAIL_APP_PASSWORD, or SMTP_HOST/USER/PASS
 */
const sendPasswordResetOtpEmail = async ({ toEmail, recipientName, otp }) => {
    try {
        const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT || 587;

        let transporter;

        if (gmailUser && gmailPass) {
            // Gmail transport
            transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: gmailUser,
                    pass: gmailPass,
                },
            });
        } else if (smtpHost && process.env.SMTP_USER && process.env.SMTP_PASS) {
            // Custom SMTP transport
            transporter = nodemailer.createTransport({
                host: smtpHost,
                port: Number(smtpPort),
                secure: Number(smtpPort) === 465,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else {
            console.warn(
                `[EMAIL] GMAIL_USER/GMAIL_APP_PASSWORD not yet configured in backend/.env. Simulated sending to ${toEmail}. OTP: ${otp}`
            );
            return {
                sent: false,
                reason: "GMAIL_NOT_CONFIGURED",
            };
        }

        const mailOptions = {
            from: `"मा नर्मदा गुरुकुल" <${gmailUser || "noreply@maanarmada.com"}>`,
            to: toEmail,
            subject: `पासवर्ड रीसेट OTP: ${otp} — मा नर्मदा आध्यात्मिक शिक्षण संस्था`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                    <div style="text-align: center; border-bottom: 2px solid #8B0000; padding-bottom: 16px; margin-bottom: 20px;">
                        <h2 style="color: #8B0000; margin: 0; font-size: 22px;">मा नर्मदा आध्यात्मिक शिक्षण संस्था</h2>
                        <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0 0;">गुरुकुल शिक्षण व सेवा प्रकल्प, बुलढाणा</p>
                    </div>

                    <p style="font-size: 15px; color: #1f2937;">सस्नेह नमस्कार <strong>${recipientName || "विद्यार्थी मित्र"}</strong>,</p>

                    <p style="font-size: 14px; color: #374151; line-height: 1.6;">
                        आपल्या विद्यार्थी पोर्टल खात्यासाठी पासवर्ड रीसेट करण्याची विनंती प्राप्त झाली आहे. आपला ६-अंकी पडताळणी OTP खालीलप्रमाणे आहे:
                    </p>

                    <div style="text-align: center; margin: 24px 0;">
                        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #8B0000; background-color: #fff1f1; padding: 12px 28px; border-radius: 8px; border: 2px dashed #8B0000;">
                            ${otp}
                        </span>
                    </div>

                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
                        <p style="margin: 0; font-size: 13px; color: #92400e;">
                            ⚠️ <strong>महत्त्वाची सूचना:</strong> हा OTP फक्त <strong>१५ मिनिटांसाठी</strong> वैध आहे. सुरक्षेसाठी हा OTP कोणाशीही शेअर करू नका.
                        </p>
                    </div>

                    <p style="font-size: 13px; color: #4b5563; line-height: 1.5;">
                        जर आपण ही पासवर्ड रीसेट विनंती केली नसेल, तर कृपया या ईमेलकडे दुर्लक्ष करा. आपले खाते पूर्णपणे सुरक्षित आहे.
                    </p>

                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

                    <div style="font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.4;">
                        मा नर्मदा आध्यात्मिक शिक्षण संस्था, चिखली रोड, बुलढाणा, महाराष्ट्र<br />
                        हा एक संगणकीकृत ईमेल आहे, कृपया यास उत्तर देऊ नका.
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Reset OTP email successfully sent to ${toEmail}: ${info.messageId}`);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error("[EMAIL] Error sending OTP email:", error);
        return { sent: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetOtpEmail,
};
