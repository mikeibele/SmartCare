const express = require('express');
const { createZoomMeeting } = require('./zoom');
const { updateZoomMeetingId } = require('./supabase');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/create-meeting', async (req, res) => {
    const { appointmentId } = req.body;

    if (!appointmentId) {
        return res.status(400).json({ error: 'Missing appointmentId' });
    }

    try {
        const meeting = await createZoomMeeting();
        await updateZoomMeetingId(appointmentId, meeting.id);

        return res.json({
            zoomMeetingId: meeting.id,
            join_url: meeting.join_url,
        });
    } catch (err) {
        console.error('Error:', err.message);
        return res.status(500).json({ error: 'Failed to create Zoom meeting' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
