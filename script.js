let alarms = [];
let alarmTimeouts = [];
let clockButton = document.querySelector('.clock-btn');
const timerButton = document.querySelector('.timer-btn');


function setAlarm() {
  const alarmInput = document.getElementById('alarmTime');
  const [hours, minutes] = alarmInput.value.split(':');
  const amPm = alarmInput.value.slice(-2);

  let alarmTime = new Date();
  alarmTime.setHours(parseInt(hours));
  alarmTime.setMinutes(parseInt(minutes));

  if (amPm === 'PM') {
    alarmTime.setHours(alarmTime.getHours() + 12);
  }

  const now = new Date();

  if (alarmTime > now) {
    alarms.push(alarmTime.toLocaleTimeString());
    saveAlarms();
    displayAlarms();
    scheduleAlarm(alarmTime);
  } else {
    alert('Please set an alarm time in the future.');
  }
}

function editAlarm(index) {
  const alarmsList = document.getElementById('alarmsList');
  const listItem = alarmsList.children[index];
  listItem.innerHTML = '';

  const inputTime = document.createElement('input');
  inputTime.setAttribute('type', 'time');
  inputTime.setAttribute('id', `editTime${index}`);
  inputTime.classList.add('input-time');

  // const amPmSelector = document.createElement('select');
  // amPmSelector.setAttribute('id', `amPmSelector${index}`);
  // const amOption = document.createElement('option');
  // amOption.value = 'AM';
  // amOption.text = 'AM';
  // const pmOption = document.createElement('option');
  // pmOption.value = 'PM';
  // pmOption.text = 'PM';
  // amPmSelector.appendChild(amOption);
  // amPmSelector.appendChild(pmOption);

  const editButton = document.createElement('button');
  editButton.textContent = 'Save';
  editButton.classList.add('save-btn');
  editButton.addEventListener('click', () => {
    const newTime = document.getElementById(`editTime${index}`).value;
    // const amPm = document.getElementById(`amPmSelector${index}`).value;
    // const editedTime = `${newTime} ${amPm}`;
    updateAlarm(index, newTime);
  });

  listItem.appendChild(inputTime);
  // listItem.appendChild(amPmSelector);
  listItem.appendChild(editButton);
}


function updateAlarm(index, newTime) {
  const [hours, minutes, amPm] = newTime.split(':');

  let updatedHours = parseInt(hours);
  if (amPm === 'PM' && updatedHours < 12) {
    updatedHours += 12;
  } else if (amPm === 'AM' && updatedHours === 12) {
    updatedHours = 0;
  }

  const updatedAlarmTime = new Date();
  updatedAlarmTime.setHours(updatedHours);
  updatedAlarmTime.setMinutes(parseInt(minutes));

  const now = new Date();

  if (updatedAlarmTime.getTime() > now.getTime() || updatedAlarmTime.getTime() === now.getTime()) {
    alarms[index] = updatedAlarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    saveAlarms();
    displayAlarms();

    clearTimeout(alarmTimeouts[index]);

    const timeToAlarm = updatedAlarmTime - now;
    const alarmTimeout = setTimeout(() => {
      startAlarm(index);
      stopSingleAlarm(index);
    }, timeToAlarm);

    alarmTimeouts[index] = alarmTimeout;
  } else {
    alert('Please set an alarm time in the future.');
  }
}
clockButton.addEventListener('click', () => {
  window.location.href = '../index.html'
});

timerButton.addEventListener('click', () => {
  document.location.href = '../timer/index.html'
})

function removeAlarm(index) {
  alarms.splice(index, 1);
  clearTimeout(alarmTimeouts[index]);
  alarmTimeouts.splice(index, 1);
  saveAlarms();
  displayAlarms();
}

function stopSingleAlarm(index) {
  clearTimeout(alarmTimeouts[index]);
  saveAlarms();
  displayAlarms();
}

function displayAlarms() {
  const alarmsList = document.getElementById('alarmsList');
  alarmsList.innerHTML = '';
  alarms.forEach((alarm, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${alarm}`;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => {
      editAlarm(index);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => {
      removeAlarm(index);
    });

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    stopButton.classList.add('stop-btn');
    stopButton.addEventListener('click', () => {
        stopAlarm(index);
    });

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(stopButton);
    alarmsList.appendChild(listItem);
  });
}

function saveAlarms() {
  localStorage.setItem('alarms', JSON.stringify(alarms));
}

function loadAlarms() {
  const storedAlarms = JSON.parse(localStorage.getItem('alarms'));
  if (storedAlarms) {
    alarms = storedAlarms;
    alarms.forEach((alarm, index) => {
      const alarmTime = new Date(alarm);
      const timeToAlarm = alarmTime - new Date();
      if (timeToAlarm > 0) {
        const alarmTimeout = setTimeout(() => {
          startAlarm(index);
          stopSingleAlarm(index);
        }, timeToAlarm);
        alarmTimeouts.push(alarmTimeout);
      }
    });
    displayAlarms();
  }
}

function scheduleAlarm(alarmTime) {
  const timeToAlarm = alarmTime - new Date();
  if (timeToAlarm > 0) {
    const alarmTimeout = setTimeout(() => {
      startAlarm(alarms.length - 1);
      stopSingleAlarm(alarms.length - 1);
    }, timeToAlarm);
    alarmTimeouts.push(alarmTimeout);
  }
}

function startAlarm(index) {
  const alarmSound = document.getElementById('alarmSound');
  alarmSound.loop = true;
  alarmSound.play();
  alarmSound.addEventListener('ended', () => {
    alarmSound.currentTime = 0;
    stopSingleAlarm(index);
  });
}

function stopAlarm(index) {
  const alarmSound = document.getElementById('alarmSound');
  alarmSound.pause();
  alarmSound.currentTime = 0;
  stopSingleAlarm(index);
}

loadAlarms();
