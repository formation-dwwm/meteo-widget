class MeteoWidget extends HTMLElement {
    constructor() {
        super(...arguments);
        this.cityName = "toulon";
    }
    static get observedAttributes() {
        return ['city'];
    }
    connectedCallback() {
        this.init();
        this.updateWeather();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "city" && oldValue != newValue) {
            this.cityName = newValue;
            this.updateWeather();
        }
    }
    init() {
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `
    <style>
      ${MeteoWidget.STYLE}
    </style>
    ${MeteoWidget.TEMPLATE}
    `;
        this.$cityName = this.root.querySelector("#city-name");
        this.$currentConditionIcon = this.root.querySelector("#current-condition-icon");
        this.$currentConditionLabel = this.root.querySelector("#current-condition-label");
        this.$currentTemp = this.root.querySelector("#current-temp");
        this.$forecastList = this.root.querySelector("#forecast-list");
    }
    updateWeather() {
        fetch(`https://www.prevision-meteo.ch/services/json/${this.cityName}`)
            .then(res => res.json())
            .then(data => this.updateView(data))
            .catch(err => this.handleError(err));
    }
    updateView(data) {
        // Update current conditions
        this.$cityName.textContent = data.city_info.name;
        this.$currentTemp.textContent = data.current_condition.tmp;
        this.$currentConditionLabel.textContent = data.current_condition.condition;
        this.$currentConditionIcon.setAttribute("src", data.current_condition.icon);
        this.updateForecastView(data);
    }
    updateForecastView(data) {
        let html = "";
        for (let dayNum = 1; dayNum <= 4; ++dayNum) {
            const dayKey = "fcst_day_" + dayNum;
            const dayData = data[dayKey];
            html += this.createForecastItemHtml(dayData, dayNum);
        }
        this.$forecastList.innerHTML = html;
    }
    createForecastItemHtml(data, dayNum) {
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
    handleError(err) {
        console.error(err);
    }
}
MeteoWidget.TEMPLATE = `
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
MeteoWidget.STYLE = `
  * {
    box-sizing: border-box;
  }
  
  .icon > img {
    width: 100%;
  }
  
  .weather {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background: #2d2d2f;
    position: relative;
    color: #d4d4d4;
  }
  
  .right-ribbon:before {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100px;
    background: #1c1c1d;
    z-index: 0;
    box-shadow: -2px 0 5px -5px black;
    border-left: 1px solid #2e2e31;
  }
  
  .right-ribbon > * {
    position: relative;
  }
  
  #city-name {
    font-size: 1.7em;
    color: white;
    padding: 12px;
    width: calc(100% - 100px);
  }
  
  .conditions-wrapper {
    display: flex;
  }
  
  .conditions-wrapper figure {
      width: 100%;
      flex-shrink: 1;
      font-size: 1em;
      text-align: center;
      margin: 0;
      padding: 6px 0;
      background: #212121;
      box-shadow: -3px 0 20px -15px black inset;
  }
  
  .current-temp-wrapper {
    width: 100px;
    flex-grow: 0;
    flex-shrink: 0;
    font-size: 3em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  
  #forecast-list {
    list-style: none;
    padding-left: 12px;
  }
  
  .forecast-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .forecast-item .date {
    width: 100%;
    flex-shrink: 1;
    font-size: 1.3em;
    /* padding-left: 12px; */
  }
  
  .forecast-item .fixed-width {
    display: block;
    width: 50px;
    flex-grow: 0;
    flex-shrink: 0;
  }
  
  .forecast-item .icon {
    display: block;
    width: 50px;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 8px;
  }
  
  .forecast-item .temp {
    text-align: center;
    font-size: 1.4em;
  }
  
  .forecast-item .temp.temp-min {
    color: #949494;
  }
  
  .forecast-item .temp.temp-max {
    color: #cecece;
  }
  `;
customElements.define('meteo-widget', MeteoWidget);
