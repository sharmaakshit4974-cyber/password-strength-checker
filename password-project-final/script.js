// ================= SAFE HELPER =================
function get(id){
  return document.getElementById(id);
}

// ================= GLOBAL =================
let generatedOTP = "";

// ================= SEND OTP =================
function sendOTP(){

let pass = get("signupPass")?.value;
let phone = get("signupPhone")?.value;
let msg = get("msg");

if(!pass || !phone){
msg && (msg.innerHTML="❌ Fill all fields");
return;
}

// PASSWORD VALIDATION
if(pass.length < 8){
msg.innerHTML="❌ Min 8 characters";
return;
}
if(!/[A-Z]/.test(pass)){
msg.innerHTML="❌ Add uppercase";
return;
}
if(!/[0-9]/.test(pass)){
msg.innerHTML="❌ Add number";
return;
}
if(!/[!@#$%^&*]/.test(pass)){
msg.innerHTML="❌ Add special char";
return;
}

// PHONE
if(!/^[0-9]{10}$/.test(phone)){
msg.innerHTML="❌ Invalid phone";
return;
}

// OTP
generatedOTP = Math.floor(1000 + Math.random()*9000);
localStorage.setItem("otpPhone", phone);

msg.innerHTML="✅ OTP Sent";
alert("OTP: " + generatedOTP);
}

// ================= VERIFY OTP =================
function verifyOTP(){

let user = get("signupUser")?.value;
let pass = get("signupPass")?.value;
let phone = get("signupPhone")?.value;
let otp = get("otpInput")?.value;
let msg = get("msg");

let savedPhone = localStorage.getItem("otpPhone");

if(phone !== savedPhone){
msg.innerHTML="❌ Wrong phone";
return;
}

if(otp != generatedOTP){
msg.innerHTML="❌ Wrong OTP";
return;
}

localStorage.setItem("username", user);
localStorage.setItem("password", pass);

msg.innerHTML="✅ Signup Success";

setTimeout(()=>{
window.location.href="login.html";
},1000);
}

// ================= LOGIN =================
function login(){

let user = get("loginUser")?.value;
let pass = get("loginPass")?.value;

let savedUser = localStorage.getItem("username");
let savedPass = localStorage.getItem("password");

if(user === savedUser && pass === savedPass){

let history = JSON.parse(localStorage.getItem("history")) || [];

history.push({
user:user,
time:new Date().toLocaleString()
});

localStorage.setItem("history", JSON.stringify(history));

window.location.href="dashboard.html";

}else{
get("loginMsg").innerHTML="❌ Invalid Credentials";
}
}

// ================= SHOW USER =================
function showUser(){
let user = localStorage.getItem("username");
let el = get("welcomeUser");
if(el) el.innerHTML = "Welcome, " + user;
}

// ================= TOGGLE PASSWORD =================
function togglePassword(id){
let input = get(id);
if(!input) return;

input.type = (input.type === "password") ? "text" : "password";
}

// ================= AI PASSWORD =================
function generatePassword(){

let chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
let password="";

// ensure strong
password += "A1@";

for(let i=0;i<5;i++){
password += chars[Math.floor(Math.random()*chars.length)];
}

// shuffle
password = password.split('').sort(()=>0.5-Math.random()).join('');

// SET PASSWORD IN INPUT
let input = document.getElementById("password");

if(input){
input.value = password;
}

// SHOW MESSAGE IN UI (NOT ALERT)
let msg = document.getElementById("aiMsg");
if(msg){
msg.innerHTML = "🤖 AI Generated Password: <b>" + password + "</b>";
}

// auto update strength
checkStrength();

}

// ================= STRENGTH + GRAPH =================
function checkStrength(){

let password = get("password")?.value;
let text = get("strengthText");

if(!password) return;

let score = 0;

if(password.length>=8) score++;
if(/[A-Z]/.test(password)) score++;
if(/[0-9]/.test(password)) score++;
if(/[!@#$%^&*]/.test(password)) score++;

let levels = ["Weak","Medium","Strong","Very Strong"];
text && (text.innerHTML = levels[score-1] || "Weak");

// ===== GRAPH =====
if(typeof Chart !== "undefined"){

let ctx = get("chart");

if(ctx){

let data=[
password.length>=8?1:0,
/[A-Z]/.test(password)?1:0,
/[0-9]/.test(password)?1:0,
/[!@#$%^&*]/.test(password)?1:0
];

if(window.myChart){
window.myChart.destroy();
}

window.myChart = new Chart(ctx,{
type:'bar',
data:{
labels:["Length","Uppercase","Number","Special"],
datasets:[{
label:"Security Level",
data:data
}]
}
});

}

}
}

// ================= HISTORY =================
function loadHistory(){

let list = get("historyList");
if(!list) return;

let history = JSON.parse(localStorage.getItem("history")) || [];

list.innerHTML="";

history.forEach(h=>{
let li=document.createElement("li");
li.innerHTML = h.user + " - " + h.time;
list.appendChild(li);
});
}

function toggleHistory(){

let panel = document.getElementById("historyPanel");

if(panel.classList.contains("active")){
panel.classList.remove("active");
}else{
panel.classList.add("active");
loadHistory();
}

}
// ================= CLEAR HISTORY =================
function clearHistory(){

if(confirm("Delete history?")){
localStorage.removeItem("history");
let list = get("historyList");
if(list) list.innerHTML="";
}
}

function copyPassword(){

let input = document.getElementById("password");

if(input && input.value !== ""){

navigator.clipboard.writeText(input.value);

let msg = document.getElementById("aiMsg");
if(msg){
msg.innerHTML = "✅ Password copied to clipboard!";
}

}else{
alert("No password to copy");
}

}

// ================= LOGOUT =================
function logout(){
window.location.href="login.html";
}