class MeteoWidget extends HTMLElement {

  constructor(){
    super();

    this.init();

    this.updateWeather("toulon");
  }

  init(){
    this.innerHTML = `
    <main class="weather right-ribbon">
      <section class="current-conditions">
        <div id="city-name"></div>
        <div class="conditions-wrapper">
          <figure>
            <img id="current-condition-icon"/>
            <figcaption id="current-condition-label"></figcaption>
          </figure>
          <div class="current-temp-wrapper right-ribbon">
            <span id="current-temp"></span>
          </div>
        </div>
      </section>
      <section class="forecast">
        <ul id="forecast-list">
  
        </ul>
      </section>
    </main>
    `;

    this.$cityName = this.querySelector("#city-name"),
    this.$currentConditionIcon = this.querySelector("#current-condition-icon"),
    this.$currentConditionLabel = this.querySelector("#current-condition-label"),
    this.$currentTemp = this.querySelector("#current-temp"),
    this.$forecastList = this.querySelector("#forecast-list");
  }


  updateWeather(cityName){
    fetch(`https://www.prevision-meteo.ch/services/json/${cityName}`)
      .then(res => res.json())
      .then(data => this.updateView(data))
      .catch(err => this.handleError(err));
  }

  updateView(data){
    // Update current conditions
    this.$cityName.textContent = data.city_info.name;
    this.$currentTemp.textContent = data.current_condition.tmp;
    this.$currentConditionLabel.textContent = data.current_condition.condition;
    this.$currentConditionIcon.setAttribute("src", data.current_condition.icon);
  
    this.updateForecastView(data);
  }
  
  updateForecastView(data){
    let html = "";
  
    for(let dayNum = 1; dayNum <= 4; ++dayNum){
      const dayKey = "fcst_day_" + dayNum;
      const dayData = data[dayKey];
      html += this.createForecastItemHtml(dayData, dayNum);
    }
  
    this.$forecastList.innerHTML = html;
  }
  
  createForecastItemHtml(data, dayNum){
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
  
  handleError(err){
    console.error(err);
  }
}

customElements.define('meteo-widget', MeteoWidget);