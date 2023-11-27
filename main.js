// 각 월의 일 수를 반환하는 함수
function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
  
  // 각 월의 시작 요일을 반환하는 함수 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  function startDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  }
  
  // 현재 년도와 월을 기준으로 달력을 렌더링하는 함수
  function renderCalendar(year, month) {
    const calendarTitle = document.getElementById('calendarTitle');
    const datesContainer = document.querySelector('.dates');
  
    // 월의 시작 요일과 일 수를 가져옴
    const firstDay = startDayOfMonth(month, year);
    const totalDays = daysInMonth(month, year);
  
    // 이전 달의 일 수와 마지막 요일을 가져옴
    const prevMonthDays = daysInMonth(month - 1, year);
    const lastDayPrevMonth = firstDay === 0 ? 7 : firstDay;
  
    calendarTitle.textContent = `${year}년 ${month + 1}월`; // 달력의 제목 설정
    datesContainer.innerHTML = ''; // 달력 내용 초기화
  
    // 이전 달의 마지막 날짜부터 달력에 표시할 날짜들을 생성하여 추가
    for (let i = lastDayPrevMonth - 1; i >= 0; i--) {
      const date = prevMonthDays - i;
      const cell = document.createElement('div');
      cell.classList.add('prev-date');
      cell.textContent = date;
      datesContainer.appendChild(cell);
    }
  
    // 현재 월의 날짜들을 달력에 추가
    for (let i = 1; i <= totalDays; i++) {
      const cell = document.createElement('div');
      cell.textContent = i;
      datesContainer.appendChild(cell);
    }
  }
  
  // 현재 날짜를 가져옴
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();
  
  // 초기 달력 렌더링
  renderCalendar(currentYear, currentMonth);
  
  // 이전 달, 다음 달 버튼 클릭 이벤트 처리
  document.getElementById('prevBtn').addEventListener('click', () => {
    currentMonth -= 1;
    if (currentMonth < 0) {
      currentYear -= 1;
      currentMonth = 11;
    }
    renderCalendar(currentYear, currentMonth);
  });
  
  document.getElementById('nextBtn').addEventListener('click', () => {
    currentMonth += 1;
    if (currentMonth > 11) {
      currentYear += 1;
      currentMonth = 0;
    }
    renderCalendar(currentYear, currentMonth);
  });
  
  // 일정 추가 관련 함수
function openModal(date) {
  const eventModal = document.getElementById('eventModal');
  const eventInput = document.getElementById('eventInput');

  eventModal.style.display = 'block';

  document.getElementById('addEventBtn').onclick = function () {
    const event = eventInput.value.trim();
    if (event !== '') {
      // 여기에 일정을 저장하거나 처리하는 로직을 추가할 수 있습니다.
      // 예를 들어, 각 날짜의 일정을 배열에 저장하거나 데이터베이스에 전송하는 등의 작업을 수행할 수 있습니다.
      alert(`일정 "${event}"을(를) ${currentYear}년 ${currentMonth + 1}월 ${date}일에 추가했습니다.`);
      eventInput.value = ''; // 입력 필드 초기화
      eventModal.style.display = 'none'; // 모달 닫기
    } else {
      alert('일정을 입력해주세요.');
    }
  };

  document.getElementsByClassName('close')[0].onclick = function () {
    eventModal.style.display = 'none'; // 모달 닫기
  };

  window.onclick = function (event) {
    if (event.target === eventModal) {
      eventModal.style.display = 'none'; // 모달 닫기
    }
  };
}

// 달력 내 날짜 클릭 이벤트 처리
document.querySelector('.dates').addEventListener('click', function (event) {
  if (event.target && event.target.matches('div')) {
    const date = event.target.textContent;
    openModal(date);
  }
});
// 각 날짜의 일정을 저장하는 객체
const events = {};

// 일정 추가 관련 함수
function openModal(date) {
  const eventModal = document.getElementById('eventModal');
  const eventInput = document.getElementById('eventInput');

  eventModal.style.display = 'block';

  document.getElementById('addEventBtn').onclick = function () {
    const event = eventInput.value.trim();
    if (event !== '') {
      // 현재 선택한 날짜의 일정 배열에 추가
      const currentDateEvents = events[`${currentYear}-${currentMonth + 1}-${date}`] || [];
      currentDateEvents.push(event);
      events[`${currentYear}-${currentMonth + 1}-${date}`] = currentDateEvents;

      // 일정 추가 후에 날짜 아래에 일정 표시
      renderEventsForDate(date);

      eventInput.value = ''; // 입력 필드 초기화
      eventModal.style.display = 'none'; // 모달 닫기
    } else {
      alert('일정을 입력해주세요.');
    }
  };

  document.getElementsByClassName('close')[0].onclick = function () {
    eventModal.style.display = 'none'; // 모달 닫기
  };

  window.onclick = function (event) {
    if (event.target === eventModal) {
      eventModal.style.display = 'none'; // 모달 닫기
    }
  };
}

// 선택한 날짜의 일정을 날짜 아래에 표시하는 함수
function renderEventsForDate(date) {
  const dateCell = document.querySelector(`.dates div:nth-child(${parseInt(date) + 1})`);
  const dateKey = `${currentYear}-${currentMonth + 1}-${date}`;
  const currentDateEvents = events[dateKey];

  if (currentDateEvents && currentDateEvents.length > 0) {
    // 해당 날짜에 일정이 있는 경우, 표시
    const eventContainer = document.createElement('div');
    eventContainer.classList.add('events-container');

    currentDateEvents.forEach((event) => {
      const eventItem = document.createElement('div');
      eventItem.classList.add('event-item');
      eventItem.textContent = event;
      eventContainer.appendChild(eventItem);
    });

    // 이미 추가된 일정이 있다면 삭제 후 새로 추가
    const existingEventContainer = dateCell.querySelector('.events-container');
    if (existingEventContainer) {
      dateCell.removeChild(existingEventContainer);
    }
    
    dateCell.appendChild(eventContainer);
  }
}

// 달력 내 날짜 클릭 이벤트 처리
document.querySelector('.dates').addEventListener('click', function (event) {
  if (event.target && event.target.matches('div')) {
    const date = event.target.textContent;
    openModal(date);
  }
});

// ... (기존 코드)

// 이전 월, 다음 월 클릭 시 일정 초기화
function clearEvents() {
  const datesContainer = document.querySelector('.dates');
  const dateCells = datesContainer.querySelectorAll('div');

  dateCells.forEach((dateCell) => {
    dateCell.innerHTML = '';
  });

  events = {}; // 일정 초기화
}

// 달력을 렌더링하는 함수 수정
function renderCalendar(year, month) {
  // ... (기존 코드)

  // 날짜 클릭 시 해당 날짜의 일정 표시
  document.querySelector('.dates').addEventListener('click', function (event) {
    if (event.target && event.target.matches('div')) {
      const date = event.target.textContent;
      renderEventsForDate(date);
    }
  });
}

// 초기화 함수 실행
clearEvents();
renderCalendar(currentYear, currentMonth);