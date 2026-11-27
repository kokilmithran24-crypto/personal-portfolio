// Accessible shared navigation, theme preference and contact form behaviour.
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
let currentTheme = savedTheme || preferredTheme;

function applyTheme(theme) {
  currentTheme = theme;
  root.dataset.theme = theme;
  if (themeButton) {
    const dark = theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    const icon = themeButton.querySelector('[aria-hidden="true"]');
    if (icon) icon.textContent = dark ? '☀' : '◐';
  }
}

applyTheme(currentTheme);

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  });
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });
}

document.querySelectorAll('.year').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get('name')).trim();
    const email = String(formData.get('email')).trim();
    const subject = String(formData.get('subject')).trim() || 'Portfolio enquiry';
    const message = String(formData.get('message')).trim();

    // Replace this address with the portfolio owner's email address.
    const recipient = 'your.email@example.com';
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const status = document.querySelector('#form-status');
    status.textContent = 'Opening your email application with the message filled in. Please review and send it there.';
    window.location.href = mailto;
  });
}

// To-do list: CRUD, delegated events, filters and local persistence.
(() => {
  const list = document.querySelector('#todo-list');
  const form = document.querySelector('#todo-form');
  if (!list || !form) return;

  const input = document.querySelector('#new-task');
  const count = document.querySelector('#task-count');
  const empty = document.querySelector('#empty-state');
  const status = document.querySelector('#todo-status');
  const clearButton = document.querySelector('#clear-completed');
  const filterButtons = document.querySelector('.todo-filters');
  const storageKey = 'portfolio-todo-tasks';
  let tasks = [];
  let filter = 'all';

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) {
      tasks = stored.filter(task =>
        task && typeof task.id === 'string' &&
        typeof task.text === 'string' &&
        typeof task.completed === 'boolean'
      );
    }
  } catch (error) {
    status.textContent = 'Saved tasks could not be read. You can still add tasks in this session.';
  }

  function saveTasks() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
      status.textContent = 'Your browser could not save changes. Check its storage settings.';
    }
  }

  function announce(message) {
    status.textContent = '';
    window.setTimeout(() => { status.textContent = message; }, 20);
  }

  function render() {
    list.replaceChildren();
    const visibleTasks = tasks.filter(task =>
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed)
    );

    visibleTasks.forEach(task => {
      const item = document.createElement('li');
      item.className = 'todo-item' + (task.completed ? ' is-completed' : '');
      item.dataset.id = task.id;

      const checkbox = document.createElement('input');
      checkbox.className = 'todo-check';
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.dataset.action = 'toggle';
      checkbox.setAttribute('aria-label', (task.completed ? 'Mark as active: ' : 'Mark as completed: ') + task.text);

      const text = document.createElement('span');
      text.className = 'todo-text';
      text.textContent = task.text;

      const actions = document.createElement('div');
      actions.className = 'todo-actions';

      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'todo-action';
      edit.dataset.action = 'edit';
      edit.textContent = 'Edit';
      edit.setAttribute('aria-label', 'Edit task: ' + task.text);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'todo-action';
      remove.dataset.action = 'delete';
      remove.textContent = 'Delete';
      remove.setAttribute('aria-label', 'Delete task: ' + task.text);

      actions.append(edit, remove);
      item.append(checkbox, text, actions);
      list.append(item);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    count.textContent = remaining + (remaining === 1 ? ' task left' : ' tasks left');
    empty.hidden = visibleTasks.length !== 0;
    empty.textContent = tasks.length === 0
      ? 'No tasks yet. Add one above to get started.'
      : filter === 'active'
        ? 'You have no active tasks. Nice work!'
        : filter === 'completed'
          ? 'No completed tasks yet.'
          : 'No tasks to show.';
    clearButton.disabled = !tasks.some(task => task.completed);
    clearButton.style.opacity = clearButton.disabled ? '.5' : '1';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }
    tasks.unshift({ id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2), text, completed: false });
    saveTasks();
    render();
    input.value = '';
    input.focus();
    announce('Task added: ' + text);
  });

  list.addEventListener('change', event => {
    const checkbox = event.target.closest('[data-action="toggle"]');
    if (!checkbox) return;
    const item = checkbox.closest('[data-id]');
    const task = tasks.find(entry => entry.id === item.dataset.id);
    if (!task) return;
    task.completed = checkbox.checked;
    saveTasks();
    render();
    announce(task.completed ? 'Task completed: ' + task.text : 'Task marked active: ' + task.text);
  });

  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const item = button.closest('[data-id]');
    const task = tasks.find(entry => entry.id === item.dataset.id);
    if (!task) return;

    if (button.dataset.action === 'delete') {
      tasks = tasks.filter(entry => entry.id !== task.id);
      saveTasks();
      render();
      announce('Task deleted: ' + task.text);
    } else if (button.dataset.action === 'edit') {
      const editForm = document.createElement('form');
      editForm.className = 'todo-edit-form';
      const editInput = document.createElement('input');
      editInput.className = 'edit-input';
      editInput.type = 'text';
      editInput.maxLength = 120;
      editInput.required = true;
      editInput.value = task.text;
      editInput.setAttribute('aria-label', 'Edit task text');
      const save = document.createElement('button');
      save.type = 'submit';
      save.className = 'todo-action';
      save.textContent = 'Save';
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'todo-action';
      cancel.dataset.action = 'cancel-edit';
      cancel.textContent = 'Cancel';
      editForm.append(editInput, save, cancel);
      item.replaceChildren(editForm);
      editInput.focus();
      editInput.select();
    } else if (button.dataset.action === 'cancel-edit') {
      render();
    }
  });

  list.addEventListener('submit', event => {
    const editForm = event.target.closest('.todo-edit-form');
    if (!editForm) return;
    event.preventDefault();
    const item = editForm.closest('[data-id]');
    const task = tasks.find(entry => entry.id === item.dataset.id);
    const editedText = editForm.querySelector('input').value.trim();
    if (!task || !editedText) return;
    task.text = editedText;
    saveTasks();
    render();
    announce('Task updated: ' + editedText);
  });

  filterButtons.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filter = button.dataset.filter;
    filterButtons.querySelectorAll('[data-filter]').forEach(option => {
      const active = option === button;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-pressed', String(active));
    });
    render();
  });

  clearButton.addEventListener('click', () => {
    const completedCount = tasks.filter(task => task.completed).length;
    if (!completedCount) return;
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    render();
    announce(completedCount + ' completed ' + (completedCount === 1 ? 'task' : 'tasks') + ' cleared.');
  });

  render();
})();


// Weather dashboard: city geocoding and current conditions via Open-Meteo.
(() => {
  const form = document.querySelector('#weather-form');
  if (!form) return;

  const input = document.querySelector('#city-search');
  const submit = document.querySelector('#weather-submit');
  const status = document.querySelector('#weather-status');
  const result = document.querySelector('#weather-result');

  const weatherCodes = {
    0: ['Clear sky', '☀️'], 1: ['Mainly clear', '🌤️'],
    2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁️'],
    45: ['Fog', '🌫️'], 48: ['Depositing rime fog', '🌫️'],
    51: ['Light drizzle', '🌦️'], 53: ['Moderate drizzle', '🌦️'],
    55: ['Dense drizzle', '🌧️'], 56: ['Light freezing drizzle', '🌧️'],
    57: ['Dense freezing drizzle', '🌧️'], 61: ['Slight rain', '🌧️'],
    63: ['Moderate rain', '🌧️'], 65: ['Heavy rain', '🌧️'],
    66: ['Light freezing rain', '🌧️'], 67: ['Heavy freezing rain', '🌧️'],
    71: ['Slight snow', '🌨️'], 73: ['Moderate snow', '🌨️'],
    75: ['Heavy snow', '❄️'], 77: ['Snow grains', '❄️'],
    80: ['Slight rain showers', '🌦️'], 81: ['Moderate rain showers', '🌧️'],
    82: ['Violent rain showers', '⛈️'], 85: ['Slight snow showers', '🌨️'],
    86: ['Heavy snow showers', '❄️'], 95: ['Thunderstorm', '⛈️'],
    96: ['Thunderstorm with slight hail', '⛈️'], 99: ['Thunderstorm with heavy hail', '⛈️']
  };

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  function showWeather(place, current) {
    const [description, symbol] = weatherCodes[current.weather_code] || ['Current conditions', '🌡️'];
    const placeName = [place.name, place.admin1, place.country].filter(Boolean).join(', ');
    setText('weather-city', placeName);
    setText('weather-country', 'CURRENT CONDITIONS');
    setText('weather-updated', current.time ? 'Local time: ' + current.time.replace('T', ' ') : '');
    setText('weather-description', description);
    setText('weather-temperature', Math.round(current.temperature_2m));
    setText('weather-feels', Math.round(current.apparent_temperature));
    setText('weather-humidity', current.relative_humidity_2m);
    setText('weather-wind', Math.round(current.wind_speed_10m));
    setText('weather-apparent', Math.round(current.apparent_temperature));
    setText('weather-rain', Number(current.precipitation).toFixed(1));
    setText('weather-symbol', symbol);
    result.hidden = false;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const city = input.value.trim();
    if (!city) {
      input.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Loading…';
    result.hidden = true;
    status.textContent = 'Finding the city and retrieving current weather…';

    try {
      const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
      geoUrl.search = new URLSearchParams({ name: city, count: '1', language: 'en', format: 'json' }).toString();
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) throw new Error('City search is temporarily unavailable. Please try again.');
      const geoData = await geoResponse.json();
      const place = geoData.results && geoData.results[0];
      if (!place) throw new Error('We could not find that city. Check the spelling and try again.');

      const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
      forecastUrl.search = new URLSearchParams({
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
        timezone: 'auto'
      }).toString();
      const weatherResponse = await fetch(forecastUrl);
      if (!weatherResponse.ok) throw new Error('Weather data is temporarily unavailable. Please try again.');
      const weatherData = await weatherResponse.json();
      if (!weatherData.current) throw new Error('The weather provider did not return current conditions for this city.');

      showWeather(place, weatherData.current);
      status.textContent = 'Current weather loaded for ' + place.name + '.';
    } catch (error) {
      status.textContent = error instanceof TypeError
        ? 'Could not connect. Check your internet connection and try again.'
        : error.message || 'Something went wrong. Please try again.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Search weather';
    }
  });
})();
