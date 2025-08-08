const plan = {
  conditioning: {
    1: "10 x 100m sprints (walk back). 3 rounds: 20 burpees, 20 push-ups, 20 jump squats",
    2: "2-mile run for time. Plank circuit: 1 min front plank + 30s side planks x3",
    3: "10 x 100m sprints. 3 rounds: 20 burpees, 20 push-ups, 20 jump squats",
    4: "2-mile run for time. Plank circuit x3",
    5: "10 x 100m sprints. 3 rounds: 20 burpees, 20 push-ups, 20 jump squats",
    6: "2-mile run for time. Plank circuit x3",
    7: "Active recovery: 20-30 min jog/walk and mobility"
  },
  workout: {
    1: "Push Strength:\nBench 4x6-8, Overhead Press 4x8, Incline DB Press 3x10, Lateral Raises 3x15, Dips 4xfailure, Hanging Leg Raises 4x15",
    2: "Pull Strength:\nBarbell Row 4x8, Pull-ups 4xfailure, DB Row 3x10, Barbell Curl 3x12, Hammer Curl 3x12, Face Pulls 3x15",
    3: "Legs & Core Power:\nBack Squat 4x6-8, RDL 4x8, Walking Lunges 3x20 steps, Bulgarian Split 3x12, Calf Raises 4x20, Weighted Plank 3x1min",
    4: "Push/Pull Hybrid Circuit x4 rounds:\n10 Pull-ups, 15 OHP, 20 Push-ups, 15 DB Rows, 20 Jump Squats",
    5: "Lower Hypertrophy:\nFront Squat 4x10, DB Step-ups 3x12, Hip Thrusts 4x12, Leg Curls 3x12, Calf Raises 4x20, Ab Wheel 3x15",
    6: "Full Body Circuit x4 rounds:\n15 Pull-ups, 20 Push-ups, 15 Deadlifts (moderate), 20 KB Swings, 200m Sprint",
    7: "Active recovery: light mobility and stretch"
  }
};

let dayIndex = 1;
let week = 1;
const maxWeeks = 8;

const conditioningEl = document.getElementById('conditioning');
const workoutDescEl = document.getElementById('workout-desc');
const weekLabel = document.getElementById('week-label');
const historyEl = document.getElementById('history');

function loadDay(){
  conditioningEl.textContent = plan.conditioning[dayIndex];
  workoutDescEl.textContent = plan.workout[dayIndex];
  weekLabel.textContent = `Week ${week} • Day ${dayIndex}`;
  renderHistory();
}

function saveLog(type, value){
  const data = JSON.parse(localStorage.getItem('bp_data')||'{}');
  data.logs = data.logs||[];
  data.logs.push({ts:Date.now(), week, day:dayIndex, type, value});
  localStorage.setItem('bp_data', JSON.stringify(data));
  renderHistory();
}

function renderHistory(){
  const data = JSON.parse(localStorage.getItem('bp_data')||'{}');
  const logs = (data.logs||[]).slice().reverse();
  if(!logs.length){ historyEl.innerHTML = "<em>No logs yet</em>"; return; }
  historyEl.innerHTML = logs.slice(0,30).map(l=>{
    const d = new Date(l.ts);
    return `<div class="entry"><strong>${d.toLocaleString()} (W${l.week}D${l.day})</strong><div>${l.type}: ${l.value}</div></div>`;
  }).join('');
}

document.getElementById('save-weight').onclick = ()=>{
  const v = document.getElementById('weight-input').value;
  if(!v) return alert('Enter a weight');
  saveLog('Weight', v);
  document.getElementById('weight-input').value='';
};
document.getElementById('save-note').onclick = ()=>{
  const v = document.getElementById('note-input').value;
  if(!v) return alert('Enter a note or lift');
  saveLog('Note', v);
  document.getElementById('note-input').value='';
};

document.getElementById('done-conditioning').onclick = ()=>{ saveLog('Done','Conditioning'); alert('Conditioning logged — good work'); };
document.getElementById('done-workout').onclick = ()=>{ saveLog('Done','Home workout'); alert('Workout logged — keep pushing'); };
document.getElementById('done-class').onclick = ()=>{ saveLog('Done','Weight class'); alert('Class logged — extra credit'); };

document.getElementById('prev-day').onclick = ()=>{
  dayIndex = (dayIndex===1?7:dayIndex-1);
  loadDay();
};
document.getElementById('next-day').onclick = ()=>{
  dayIndex = (dayIndex===7?1:dayIndex+1);
  if(dayIndex===1) week = Math.min(maxWeeks, week+1);
  loadDay();
};
document.getElementById('reset-week').onclick = ()=>{
  if(confirm('Reset all saved data and start over?')){ localStorage.removeItem('bp_data'); week=1; dayIndex=1; loadDay(); }
};
document.getElementById('export-data').onclick = ()=>{
  const data = localStorage.getItem('bp_data')||'{}';
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download='battle_plan_data.json'; a.click();
  URL.revokeObjectURL(url);
};

document.getElementById('print-plan').onclick = ()=>{ window.open('/print.html','_blank'); };

loadDay();
