const $cityName = document.getElementById("city-name"),
      $currentDate = document.getElementById("current-date"),
      $currentConditionIcon = document.getElementById("current-condition-icon"),
      $currentConditionLabel = document.getElementById("current-condition-label"),
      $currentTemp = document.getElementById("current-temp");

function updateWeather(cityName){
  fetch(`https://www.prevision-meteo.ch/services/json/${cityName}`)
    .then(res => res.json())
    .then(data => updateView(data))
    .catch(err => handleError(err));
}

function updateView(data){
  $cityName.textContent = data.city_info.name;
  $currentDate.textContent = data.current_condition.date;
  $currentTemp.textContent = data.current_condition.tmp;
  $currentConditionLabel.textContent = data.current_condition.condition;
  $currentConditionIcon.setAttribute("src", data.current_condition.icon);
}

function handleError(err){
  console.error(err);
}

updateWeather("toulon");