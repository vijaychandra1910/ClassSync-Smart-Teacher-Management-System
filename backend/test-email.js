/**
 * Test script for emailService.js
 * Run this with: node test-email.js
 */

require('dotenv').config();
const { sendLoginCredentials } = require('./src/services/emailService');

// Test email - replace with your own email address for testing
const testEmail = process.env.TEST_EMAIL || 'your-email@gmail.com';
const testPassword = 'TestPassword123!';

console.log('🧪 Testing Email Service...\n');
console.log('Configuration:');
console.log(`  EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}`);
console.log(`  EMAIL_PASS: ${process.env.EMAIL_PASS ? '***SET***' : 'NOT SET'}`);
console.log(`  Test Email: ${testEmail}\n`);

// Check if environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ ERROR: EMAIL_USER or EMAIL_PASS not set in .env file');
  console.error('   Please check your .env file and ensure both are configured.');
  process.exit(1);
}

// Test the email service
(async () => {
  try {
    console.log('📧 Sending test email...');
    await sendLoginCredentials(testEmail, testPassword);
    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log(`   Check your inbox at: ${testEmail}`);
    console.log('   (Also check spam/junk folder if not in inbox)');
  } catch (error) {
    console.error('\n❌ FAILED to send email:');
    console.error('   Error:', error.message);
    if (error.code === 'EAUTH') {
      console.error('\n   💡 This is an authentication error.');
      console.error('   Make sure you:');
      console.error('   1. Have 2-Step Verification enabled on your Google account');
      console.error('   2. Created an App Password (not your regular password)');
      console.error('   3. Put the 16-character App Password in .env (no spaces)');
    }
    process.exit(1);
  }
})();

