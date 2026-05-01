const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const statusMsg = document.getElementById('statusMsg');
const loadingState = document.getElementById('loadingState');
const resultsGrid = document.getElementById('resultsGrid');

function showStatus(msg, isError) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (isError ? ' status-msg--error' : '');
  statusMsg.style.display = 'block';
}

function hideStatus() {
  statusMsg.style.display = 'none';
}

function formatNumber(n) {
  return n ? n.toLocaleString() : 'N/A';
}

function getLanguages(langs) {
  if (!langs) return 'N/A';
  return Object.values(langs).slice(0, 2).join(', ');
}

function buildCard(country) {
  const name = country.name?.common || 'Unknown';
  const flag = country.flags?.svg || country.flags?.png || '';
  const capital = (country.capital || ['N/A'])[0];
  const region = country.region || 'N/A';
  const population = formatNumber(country.population);
  const languages = getLanguages(country.languages);

  const card = document.createElement('div');
  card.className = 'country-card';
  card.innerHTML = `
    <img src="${flag}" alt="Flag of ${name}" class="country-flag" loading="lazy" />
    <div class="country-info">
      <h3 class="country-name">${name}</h3>
      <p class="country-detail"><span class="country-icon">🏛</span> ${capital}</p>
      <p class="country-detail"><span class="country-icon">🌍</span> ${region}</p>
      <p class="country-detail"><span class="country-icon">👥</span> ${population}</p>
      <p class="country-detail"><span class="country-icon">🗣</span> ${languages}</p>
    </div>
  `;
  return card;
}

async function search() {
  const query = searchInput.value.trim();
  if (!query) {
    showStatus('Please enter a country name to search.', true);
    return;
  }

  hideStatus();
  resultsGrid.innerHTML = '';
  loadingState.style.display = 'flex';

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
    loadingState.style.display = 'none';

    if (res.status === 404) {
      showStatus('No countries found. Try a different name.', true);
      return;
    }
    if (!res.ok) {
      showStatus('Something went wrong. Please try again.', true);
      return;
    }

    const data = await res.json();
    showStatus(data.length + ' result' + (data.length !== 1 ? 's' : '') + ' found', false);
    data.forEach(c => resultsGrid.appendChild(buildCard(c)));
  } catch (err) {
    loadingState.style.display = 'none';
    showStatus('Network error. Check your connection and try again.', true);
  }
}

searchBtn.addEventListener('click', search);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
