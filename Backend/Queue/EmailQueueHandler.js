const Queue = require('bull');
const sendEmail = require('../../Middleware/Email/sendmail'); // Assuming you have a function to send emails

const emailQueue = new Queue('emailQueue');

emailQueue.process(async (job, done) => {
    const { email, name } = job.data;
    try {
        await sendEmail(email, `Welcome ${name}!`, 'Please verify your email...');
        done();
    } catch (err) {
        done(err);
    }
});

module.exports = emailQueue;