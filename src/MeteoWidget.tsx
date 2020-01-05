import { IWeatherData, IForecastDayData, ICurrentConditionsData, IHourlyData, IForecastHourData } from './WeatherData';
import JSXFactory from './JSXFactory.js';

class MeteoWidget extends HTMLElement {

  protected cityName: string = "paris";
  
  protected root: ShadowRoot;
  protected $cityName: HTMLElement;
  protected $currentConditionLabel: HTMLElement;
  protected $currentTemp: HTMLElement;
  protected $dayTimeline: HTMLElement;
  protected $forecastList: HTMLElement;
  protected $currentConditionIcon: HTMLImageElement;

  static get observedAttributes(): Array<string> {
    return ['city'];
  }
  
  public connectedCallback(): void {
    this.init();

    this.updateWeather();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if(name == "city" && oldValue != newValue && newValue != ""){
      this.setCity(newValue);
    }
  }

  public setCity(cityName: string): void {
    if(this.cityName == cityName){
      return;
    }
    
    this.cityName = cityName;

    this.updateWeather();
  }

  protected init(): void {
    this.root = this.attachShadow({mode: 'open'});
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
    this.$dayTimeline = this.root.querySelector(".day-timeline");
    this.$forecastList = this.root.querySelector("#forecast-list");
  }


  protected updateWeather(): void {
    fetch(`https://www.prevision-meteo.ch/services/json/${this.cityName}`)
      .then((res: Response) => res.json())
      .then((data: IWeatherData) => this.updateView(data))
      .catch((err: Error) => this.handleError(err));
  }

  protected updateView(data: IWeatherData): void {
    // Update current conditions
    this.$cityName.textContent = data.city_info.name;
    this.$currentTemp.textContent = ''+data.current_condition.tmp;
    this.$currentConditionLabel.textContent = data.current_condition.condition;
    this.$currentConditionIcon.setAttribute("src", data.current_condition.icon);
  
    this.updateTimelineView(data.fcst_day_0.hourly_data);

    this.updateForecastView(data);
  }

  protected updateTimelineView(data: IHourlyData){
    this.$dayTimeline.innerHTML = 
      Object.keys(data)
        .map((hourKey: string) => this.createDayHourItemHtml(hourKey, data[hourKey]))
        .join('');
  }
  
  protected updateForecastView(data: IWeatherData): void {
    let html = "";
  
    for(let dayNum = 1; dayNum <= 4; ++dayNum){
      const dayKey = "fcst_day_" + dayNum;
      const dayData = data[dayKey];
      html += this.createForecastItemHtml(dayData, dayNum);
    }
  
    this.$forecastList.innerHTML = html;
  }

  protected createDayHourItemHtml(hourKey: string, hourData: IForecastHourData): string {
    return (
    <div class="hour-item">
      <div class="fixed-width icon">
        <img src={hourData.ICON} title={hourData.CONDITION} alt={hourData.CONDITION}/>
      </div>
      <div class="temp">{hourData.TMP2m}°C</div>
      <div class="hour">{hourKey}</div>
    </div>
    );
  }
  
  protected createForecastItemHtml(dayData: IForecastDayData, dayNum: number): string {
    return (
      <li class="forecast-item">
        <span class="date">{dayData.day_long}</span>
        <div class="fixed-width icon">
          <img src={dayData.icon} title={dayData.condition} alt={dayData.condition}/>
        </div>
        <span class="fixed-width temp temp-max">{dayData.tmax}</span>
        <span class="fixed-width temp temp-min">{dayData.tmin}</span>
      </li>
    );
  }
  
  protected handleError(err: Error): void {
    console.error(err);
  }

  static TEMPLATE: string = (
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
    <section class="day-timeline">

    </section>
    <section class="forecast">
      <ul id="forecast-list">

      </ul>
    </section>
  </main>
  );

  static STYLE: string = `
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

  .day-timeline {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    margin-right: 100px;
  }

  .day-timeline .hour-item {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-shrink: 0;
    padding: 7px;
  }

  .day-timeline .hour-item .icon {
    width: 25px;
  }

  .day-timeline .hour-item .temp {
    font-size: 18px;
    text-align: center;
  }

  .day-timeline .hour-item .hour {
    width: 100%;
    flex-shrink: 0;
    text-align: center;
    color: #949494;
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

  ::-webkit-scrollbar {
    background-color: #F5F5F5;
  } 
  ::-webkit-scrollbar-thumb {
    background-color: #2d2d2f;
    border: 1px solid #1c1c1d;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #212121;
  }
  `;
}

customElements.define('meteo-widget', MeteoWidget);