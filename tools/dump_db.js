const db = require('../backend/db');

function q(sql){
  return new Promise((res, rej)=>db.all(sql, (err, rows)=>err?rej(err):res(rows)));
}

(async ()=>{
  try{
    console.log('\n--- courses ---');
    console.table(await q('SELECT id, course_name FROM courses'));
    console.log('\n--- users ---');
    console.table(await q('SELECT id, name, role FROM users'));
    console.log('\n--- course_students ---');
    console.table(await q('SELECT * FROM course_students LIMIT 50'));
  }catch(e){
    console.error('error', e);
  }finally{
    db.close();
  }
})();