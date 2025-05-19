const axios = require('axios');
require('dotenv').config();

async function getZoomAccessToken() {
    const credentials = `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`;
    const encoded = Buffer.from(credentials).toString('base64');

    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

    const res = await axios.post(url, {}, {
        headers: {
            Authorization: `Basic ${encoded}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return res.data.access_token;
}

async function createZoomMeeting(topic = "SmartCare Appointment") {
    const token = await getZoomAccessToken();

    const res = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
            topic,
            type: 1, // Instant meeting
            settings: {
                join_before_host: true,
                approval_type: 0,
                audio: "both",
            },
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return res.data; // Includes id, join_url, etc.
}

module.exports = { createZoomMeeting };
