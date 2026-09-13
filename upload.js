const input=document.getElementById('videoInput');
const preview=document.getElementById('preview');
if(input){input.onchange=()=>{if(input.files[0])preview.src=URL.createObjectURL(input.files[0]);}}
function demoAnalyze(){
document.getElementById('status').innerHTML='AI扫描中...<br>✔人体检测<br>✔动作分析<br>✔生成报告';
setTimeout(()=>location.href='analysis.html',2500);
}