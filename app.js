'use strict';
const page = document.body.dataset.page;
if (page === 'upload') {
 const input = document.querySelector('#video-file'), video = document.querySelector('#preview'), status = document.querySelector('#upload-status');
 let url;
 const release = () => { video.pause(); video.removeAttribute('src'); video.load(); video.hidden = true; if (url) URL.revokeObjectURL(url); url = null; };
 input.addEventListener('change', () => {
  release(); const file = input.files[0];
  if (!file) { status.textContent = '请选择视频。'; return; }
  if ((!file.type.startsWith('video/') && !/\.(mp4|mov|webm|m4v)$/i.test(file.name)) || file.size === 0 || file.size > 100 * 1024 * 1024) { status.textContent = '请选择有效的视频文件，大小不超过 100 MB。'; input.value = ''; return; }
  url = URL.createObjectURL(file); video.src = url; video.hidden = false; status.textContent = '正在加载视频…';
 });
 video.addEventListener('loadedmetadata', () => { status.textContent = '视频已就绪，可以播放预览。'; });
 video.addEventListener('error', () => { if (url) { status.textContent = '浏览器无法播放此编码，请尝试其他 MP4 视频。'; release(); } });
 window.addEventListener('pagehide', release);
}
if (page === 'training') {
 const button = document.querySelector('#complete'), status = document.querySelector('#training-status');
 const now = new Date(), day = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
 let days = [], available = true;
 try { const saved = JSON.parse(localStorage.getItem('motion.training') || '[]'); if (Array.isArray(saved)) days = [...new Set(saved.filter(x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)))]; } catch { available = false; }
 const update = () => { const done = days.includes(day); button.disabled = done || ![...document.querySelectorAll('.drill')].every(x=>x.checked); status.textContent = `${done ? '今日已完成！' : '完成三项练习后即可打卡。'} 累计 ${days.length} 天。${available ? '' : ' 浏览器存储不可用，当前记录仅在此页面有效。'}`; };
 document.querySelectorAll('.drill').forEach(x=>x.addEventListener('change',update));
 button.addEventListener('click',()=>{ if (button.disabled) return; days.push(day); try { localStorage.setItem('motion.training',JSON.stringify(days)); } catch { available = false; } update(); }); update();
}
if (page === 'game') {
 const button = document.querySelector('#shoot'), needle = document.querySelector('#needle'), status = document.querySelector('#game-status');
 let running = false, start = 0, frame = 0, score = 0, shots = 0;
 const position = time => { const phase = ((time-start)/1400)%2; return (phase<=1?phase:2-phase)*100; };
 const draw = time => { needle.style.left = `calc(${position(time)}% - ${position(time)/100*4}px)`; if (running) frame=requestAnimationFrame(draw); };
 button.addEventListener('click',()=>{
  if (!running) { running=true; start=performance.now(); button.textContent='出手！'; status.textContent='看准绿色区域，再次点击！'; frame=requestAnimationFrame(draw); }
  else { const pos=position(performance.now()); running=false; cancelAnimationFrame(frame); needle.style.left=`calc(${pos}% - ${pos/100*4}px)`; shots++; const hit=pos>=70&&pos<=84; if(hit) score+=3; status.textContent=hit?'命中！+3 分':pos<70?'出手稍早，再试一次。':'出手稍晚，再试一次。'; document.querySelector('#game-score').textContent=`${score} 分 · ${shots} 次出手`; button.textContent='再来一次'; }
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){running=false;cancelAnimationFrame(frame);button.textContent='重新开始';status.textContent='挑战已暂停，请重新开始。';}});
}
