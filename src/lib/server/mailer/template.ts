import { Mailer } from './mailer';

const PRIMARY = '#0ea5e9';
const PRIMARY_HOVER = '#0284c7';
const SURFACE = '#ffffff';
const BACKGROUND = '#f8fafc';
const BORDER = '#e2e8f0';
const TEXT_PRIMARY = '#0f172a';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#64748b';

interface EmailProps {
	to: string;
	subject: string;
	heading: string;
	body: string;
	buttonText: string;
	buttonUrl: string;
	footerNote?: string;
}

export async function sendEmail(props: EmailProps) {
	await Mailer({
		to: props.to,
		subject: props.subject,
		html: emailTemplate(props)
	});
}

function emailTemplate(props: EmailProps): string {
	const footerNote =
		props.footerNote || "If you didn't request this, you can safely ignore this email.";

	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${props.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BACKGROUND}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: ${TEXT_PRIMARY}; line-height: 1.5; -webkit-font-smoothing: antialiased;">
    <div role="presentation" style="max-width: 600px; margin: 0 auto; padding: 24px;">
        <!-- Logo/Branding Area (Optional) -->
        <div style="text-align: center; margin-bottom: 32px;">
            <!-- Add your logo here -->
            <!-- <img src="https://example.com/logo.png" alt="Company" width="120" style="max-width: 100%; height: auto;"> -->
        </div>

        <!-- Main Card -->
        <div style="background: ${SURFACE}; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid ${BORDER};">

            <!-- Header Section -->
            <div style="padding: 40px 32px; text-align: center; border-bottom: 1px solid ${BORDER};">
                <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.01em;">
                    ${props.heading}
                </h1>
                <p style="margin: 0; font-size: 16px; color: ${TEXT_SECONDARY}; line-height: 1.6;">
                    ${props.body}
                </p>
            </div>

            <!-- Action Section -->
            <div style="padding: 40px 32px; text-align: center;">
                <a href="${props.buttonUrl}"
                   style="display: inline-block; padding: 14px 40px; background: ${PRIMARY}; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; line-height: 1.5; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);"
                   onmouseover="this.style.backgroundColor='${PRIMARY_HOVER}';this.style.boxShadow='0 4px 12px rgba(14, 165, 233, 0.3)';"
                   onmouseout="this.style.backgroundColor='${PRIMARY}';this.style.boxShadow='0 2px 8px rgba(14, 165, 233, 0.2)';">
                    ${props.buttonText}
                </a>

                <!-- Divider -->
                <div style="margin: 32px 0; position: relative; text-align: center;">
                    <div style="height: 1px; background-color: ${BORDER};"></div>
                    <span style="position: relative; top: -10px; background-color: ${SURFACE}; padding: 0 16px; color: ${TEXT_MUTED}; font-size: 14px;">
                        Or copy link below
                    </span>
                </div>

                <!-- Alternative Link -->
                <div style="background: ${BACKGROUND}; border-radius: 10px; padding: 16px; border: 1px solid ${BORDER};">
                    <p style="margin: 0; font-size: 14px; color: ${TEXT_MUTED}; margin-bottom: 8px; font-weight: 500;">
                        Copy this link:
                    </p>
                    <code style="display: block; padding: 12px; background: ${SURFACE}; border-radius: 6px; font-size: 14px; color: ${TEXT_PRIMARY}; word-break: break-all; font-family: 'SF Mono', Monaco, Consolas, monospace;">
                        ${props.buttonUrl}
                    </code>
                </div>
            </div>

            <!-- Footer -->
            <div style="padding: 24px 32px; background: ${BACKGROUND}; border-top: 1px solid ${BORDER}; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: ${TEXT_MUTED}; line-height: 1.5;">
                    ${footerNote}
                </p>
                <p style="margin: 16px 0 0; font-size: 12px; color: ${TEXT_MUTED}; opacity: 0.8;">
                    &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                </p>
            </div>
        </div>

        <!-- Bottom Notice -->
        <div style="text-align: center; margin-top: 24px; padding: 0 16px;">
            <p style="margin: 0; font-size: 12px; color: ${TEXT_MUTED}; opacity: 0.7;">
                This email was sent to ${props.to}.
                <br>
                Need help? <a href="mailto:support@example.com" style="color: ${PRIMARY}; text-decoration: none;">Contact our support team</a>
            </p>
        </div>
    </div>
</body>
</html>
`;
}
