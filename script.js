const subjectInput = document.getElementById("subjectInput");
const subjectSelect = document.getElementById("subjectSelect");
const dateInput = document.getElementById("dateInput");
const statusSelect = document.getElementById("statusSelect");
const attendanceDisplay = document.getElementById("attendanceDisplay");

let attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || {};
let totalClassesData = JSON.parse(localStorage.getItem("totalClassesData")) || {};

function updateSubjectList() {
  subjectSelect.innerHTML = "";
  for (let subject in attendanceData) {
    let opt = document.createElement("option");
    opt.value = subject;
    opt.textContent = subject;
    subjectSelect.appendChild(opt);
  }
}

function addSubject() {
  const subject = subjectInput.value.trim();
  if (subject && !attendanceData[subject]) {
    attendanceData[subject] = [];
    totalClassesData[subject] = 0;
    saveData();
    updateSubjectList();
    subjectInput.value = "";
    showAttendance();
  }
}

function markAttendance() {
  const subject = subjectSelect.value;
  const date = dateInput.value;
  const status = statusSelect.value;

  if (!subject || !date || !status) return;

  const alreadyMarked = attendanceData[subject].some(entry => entry.date === date);
  if (alreadyMarked) {
    alert("You’ve already marked attendance for this date.");
    return;
  }

  attendanceData[subject].push({ date, status });
  totalClassesData[subject] += 1;
  saveData();
  showAttendance();
}

function showAttendance() {
  attendanceDisplay.innerHTML = "";

  for (let subject in attendanceData) {
    const records = attendanceData[subject];
    const attended = records.filter(r => r.status === "present").length;
    const total = totalClassesData[subject] || 0;
    const percent = total > 0 ? ((attended / total) * 100).toFixed(2) : "N/A";

    let section = document.createElement("div");
    section.innerHTML = `<h4>${subject}</h4>
      <p>✅ Attended: ${attended} / 📚 Total: ${total} → 📊 ${percent}%</p>`;

    let ul = document.createElement("ul");
    records.forEach(({ date, status }) => {
      let li = document.createElement("li");
      li.textContent = `${status === "present" ? "✔️" : "❌"} ${date}`;
      ul.appendChild(li);
    });

    section.appendChild(ul);
    attendanceDisplay.appendChild(section);
  }
}

function saveData() {
  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
  localStorage.setItem("totalClassesData", JSON.stringify(totalClassesData));
}

function clearData() {
  if (confirm("Are you sure you want to delete all attendance data?")) {
    localStorage.removeItem("attendanceData");
    localStorage.removeItem("totalClassesData");
    attendanceData = {};
    totalClassesData = {};
    updateSubjectList();
    showAttendance();
  }
}

updateSubjectList();
showAttendance();