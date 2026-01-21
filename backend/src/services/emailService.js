const nodemailer = require('nodemailer');
require("dotenv").config();


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional but very helpful: verify SMTP configuration at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error (emailService):", error);
  } else {
    console.log("SMTP server is ready to take messages");
  }
});


const sendLoginCredentials = async (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to ClassSync - Your Account Details',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to ClassSync!</h2>
        <p>An account has been created for you by an admin. You can now log in using the following credentials:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>We recommend changing your password after your first login.</p>
        <a href="${process.env.CORS_ORIGIN || 'http://localhost:5173'}/login" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
        <p>If you have any questions, please contact your administrator.</p>
        <p>Best regards,<br/>The ClassSync Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Login credentials sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    if (error && error.response) {
      console.error("SMTP error response:", error.response);
    }
  }
};

/**
 * Send email to substitute teacher when they are assigned to cover a class
 * @param {string} substituteEmail - Email of the substitute teacher
 * @param {string} substituteName - Name of the substitute teacher
 * @param {string} originalTeacherName - Name of the absent teacher
 * @param {string} subject - Subject name
 * @param {string} classSection - Class and section (e.g., "10A")
 * @param {Date} date - Date of the substitution
 * @param {number} periodIndex - Period number (0-indexed)
 */
const sendSubstitutionAssignmentEmail = async (
  substituteEmail,
  substituteName,
  originalTeacherName,
  subject,
  classSection,
  date,
  periodIndex
) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: substituteEmail,
    subject: `Substitution Assignment - ${subject} (Class ${classSection})`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px;">
        <h2 style="color: #4F46E5;">Substitution Assignment</h2>
        <p>Hello ${substituteName},</p>
        <p>You have been assigned to cover a class due to a teacher's absence.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Assignment Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>📅 Date:</strong> ${formattedDate}</li>
            <li style="margin: 10px 0;"><strong>⏰ Period:</strong> Period ${periodIndex + 1}</li>
            <li style="margin: 10px 0;"><strong>📚 Subject:</strong> ${subject}</li>
            <li style="margin: 10px 0;"><strong>👥 Class:</strong> ${classSection}</li>
            <li style="margin: 10px 0;"><strong>👤 Absent Teacher:</strong> ${originalTeacherName}</li>
          </ul>
        </div>
        
        <p>Please be prepared to take this class. If you have any questions or concerns, please contact the administration.</p>
        <p>Thank you for your cooperation!</p>
        <p>Best regards,<br/>The ClassSync Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Substitution assignment email sent to ${substituteEmail}`);
  } catch (error) {
    console.error(`Failed to send substitution email to ${substituteEmail}:`, error);
    if (error && error.response) {
      console.error("SMTP error response:", error.response);
    }
  }
};

/**
 * Send email to absent teacher when their leave is approved with substitution details
 * @param {string} teacherEmail - Email of the absent teacher
 * @param {string} teacherName - Name of the absent teacher
 * @param {Date} fromDate - Leave start date
 * @param {Date} toDate - Leave end date
 * @param {Array} substitutions - Array of substitution objects with details
 * @param {string} adminComment - Optional admin comment
 */
const sendLeaveApprovedWithSubstitutionEmail = async (
  teacherEmail,
  teacherName,
  fromDate,
  toDate,
  substitutions = [],
  adminComment = ""
) => {
  const formattedFrom = new Date(fromDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTo = new Date(toDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Group substitutions by substitute teacher
  const substitutionsByTeacher = {};
  substitutions.forEach(sub => {
    const subTeacherName = sub.substituteName || 'Assigned Teacher';
    if (!substitutionsByTeacher[subTeacherName]) {
      substitutionsByTeacher[subTeacherName] = [];
    }
    substitutionsByTeacher[subTeacherName].push(sub);
  });

  let substitutionsHtml = '';
  if (substitutions.length > 0) {
    substitutionsHtml = `
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Substitution Arrangements:</h3>
        <p>Your classes have been covered by the following teachers:</p>
        ${Object.entries(substitutionsByTeacher).map(([subTeacherName, subs]) => `
          <div style="margin: 15px 0; padding: 10px; background-color: white; border-radius: 5px;">
            <strong>👤 ${subTeacherName}</strong> will cover:
            <ul style="margin: 10px 0; padding-left: 20px;">
              ${subs.map(sub => {
                const dateStr = new Date(sub.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
                return `<li>${sub.subject} - Class ${sub.classSection} on ${dateStr}, Period ${sub.periodIndex + 1}</li>`;
              }).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    substitutionsHtml = `
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>⚠️ Note:</strong> Some of your classes may need manual substitution arrangements. Please contact the administration if needed.</p>
      </div>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: teacherEmail,
    subject: 'Leave Approved - Substitution Arrangements',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px;">
        <h2 style="color: #4F46E5;">Leave Request Approved</h2>
        <p>Hello ${teacherName},</p>
        <p>Your leave request has been <strong style="color: #10b981;">approved</strong>.</p>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Leave Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>📅 From:</strong> ${formattedFrom}</li>
            <li style="margin: 10px 0;"><strong>📅 To:</strong> ${formattedTo}</li>
            ${adminComment ? `<li style="margin: 10px 0;"><strong>💬 Admin Comment:</strong> ${adminComment}</li>` : ''}
          </ul>
        </div>

        ${substitutionsHtml}

        <p>You can now proceed with your leave. Thank you for submitting your request in advance.</p>
        <p>Best regards,<br/>The ClassSync Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Leave approval with substitution email sent to ${teacherEmail}`);
  } catch (error) {
    console.error(`Failed to send leave approval email to ${teacherEmail}:`, error);
    if (error && error.response) {
      console.error("SMTP error response:", error.response);
    }
  }
};

module.exports = { 
  sendLoginCredentials,
  sendSubstitutionAssignmentEmail,
  sendLeaveApprovedWithSubstitutionEmail
};