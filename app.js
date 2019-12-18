const $cityName = document.getElementById("city-name"),
      $currentConditionIcon = document.getElementById("current-condition-icon"),
      $currentConditionLabel = document.getElementById("current-condition-label"),
      $currentTemp = document.getElementById("current-temp"),
      $forecastList = document.getElementById("forecast-list");

function updateWeather(cityName){
  fetch(`https://www.prevision-meteo.ch/services/json/${cityName}`)
    .then(res => res.json())
    .then(data => updateView(data))
    .catch(err => handleError(err));
}

function updateView(data){
  // Update current conditions
  $cityName.textContent = data.city_info.name;
  $currentTemp.textContent = data.current_condition.tmp;
  $currentConditionLabel.textContent = data.current_condition.condition;
  $currentConditionIcon.setAttribute("src", data.current_condition.icon);

  updateForecastView(data);
}

function updateForecastView(data){
  let html = "";

  for(let dayNum = 1; dayNum <= 4; ++dayNum){
    const dayKey = "fcst_day_" + dayNum;
    const dayData = data[dayKey];
    html += createForecastItemHtml(dayData, dayNum);
  }

  $forecastList.innerHTML = html;
}

function createForecastItemHtml(data, dayNum){
  return `
<li class="forecast-item">
  <span class="date">${data.day_long}</span>
  <div class="fixed-width icon">
    <img src="${data.icon}"/>
  </div>
  <span class="fixed-width temp temp-max">${data.tmax}</span>
  <span class="fixed-width temp temp-min">${data.tmin}</span>
</li>
  `;
}

function handleError(err){
  console.error(err);
}

updateWeather("toulon");