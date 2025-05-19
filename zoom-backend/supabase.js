const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateZoomMeetingId(appointmentId, zoomMeetingId) {
    const { data, error } = await supabase
        .from('appointments')
        .update({ zoom_meeting_id: zoomMeetingId })
        .eq('id', appointmentId);

    if (error) throw error;
    return data;
}

module.exports = { updateZoomMeetingId };
