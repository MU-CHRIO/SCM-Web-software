# Features: Clubs & Events

Overview
- Admins and Faculty can create Clubs and Events.
- Students can view and join Clubs/Events.
- Club creators are automatically added as club admin members.
- Duplicate joins are prevented (clear 400 responses).

API
- POST /api/clubs { name, description, created_by }
- GET /api/clubs
- POST /api/clubs/:id/join { user_id }
- GET /api/clubs/:id/members

- POST /api/events { title, description, club_id?, created_by, start_time?, end_time?, location? }
- GET /api/events
- POST /api/events/:id/join { user_id }
- GET /api/events/:id/participants

Client behavior
- Clubs/Events pages show lists and allow creators to create new items (only if role is admin or faculty).
- Students see Join buttons and cannot create clubs/events.
- UI shows "Joined" state and disables Join if the current user is already a member/participant.
