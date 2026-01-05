const db = require('../backend/db');

function q(sql){
  return new Promise((res, rej)=>db.all(sql, (err, rows)=>err?rej(err):res(rows)));
}

(async ()=>{
  try{
    console.log('\n--- clubs ---');
    console.table(await q('SELECT id, name, description, created_by FROM clubs'));
    console.log('\n--- club_members ---');
    console.table(await q('SELECT club_id, user_id, role, joined_at FROM club_members'));
    console.log('\n--- events ---');
    console.table(await q('SELECT id, title, club_id, start_time, end_time, location FROM events'));
    console.log('\n--- event_participants ---');
    console.table(await q('SELECT event_id, user_id, status, joined_at FROM event_participants'));
  }catch(e){
    console.error('error', e);
  }finally{
    db.close();
  }
})();