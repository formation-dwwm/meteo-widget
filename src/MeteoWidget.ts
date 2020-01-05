interface ICityInfoData {
  name: string;
  country: string;
  latitude: string;
  longitude: string;
  elevation: string;
  sunrise: string;
  sunset: string;
}

interface IForecastInfoData {
  latitude: string | null;
  longitude: string | null;
  elevation: string;
}

interface ICurrentConditionsData {
  date: string;
  hour: string;
  tmp: number;
  wnd_spd: number;
  wnd_gust: number;
  wnd_dir: string;
  pressure: number;
  humidity: number;
  condition: string;
  condition_key: string;
  icon: string;
  icon_big: string;
}

interface IForecastHourData {
  ICON: string;
  CONDITION: string;
  CONDITION_KEY: string;
  TMP2m: number;
  DPT2m: number;
  WINDCHILL2m: number;
  HUMIDEX: number;
  RH2m: number;
  APCPsfc: number;
  WNDSPD10m: number;
  WNDGUST10m: number;
  WNDDIR10m: number;
  string;
  ISSNOW: number;
  HCDC: string;
  MCDC: string;
  LCDC: string;
  HGT0C: number;
  KINDEX: number;
  CAPE180_0: string;
  CIN180_0: number;
}

interface IHourlyData {
  "0H00": IForecastHourData;
  "1H00": IForecastHourData;
  "2H00": IForecastHourData;
  "3H00": IForecastHourData;
  "4H00": IForecastHourData;
  "5H00": IForecastHourData;
  "6H00": IForecastHourData;
  "7H00": IForecastHourData;
  "8H00": IForecastHourData;
  "9H00": IForecastHourData;
  "10H00": IForecastHourData;
  "11H00": IForecastHourData;
  "12H00": IForecastHourData;
  "13H00": IForecastHourData;
  "14H00": IForecastHourData;
  "15H00": IForecastHourData;
  "16H00": IForecastHourData;
  "17H00": IForecastHourData;
  "18H00": IForecastHourData;
  "19H00": IForecastHourData;
  "20H00": IForecastHourData;
  "21H00": IForecastHourData;
  "22H00": IForecastHourData;
  "23H00": IForecastHourData;
}

interface IForecastDayData {
  date: string;
  day_short: string;
  day_long: string;
  tmin: number;
  tmax: number;
  condition: string;
  condition_key: string;
  icon: string;
  icon_big: string;
  hourly_data: IHourlyData;
}

interface IWeatherData{
  city_info: ICityInfoData;
  forecast_info: IForecastInfoData;
  current_condition: ICurrentConditionsData;
  fcst_day_0: IForecastDayData;
  fcst_day_1: IForecastDayData;
  fcst_day_2: IForecastDayData;
  fcst_day_3: IForecastDayData;
  fcst_day_4: IForecastDayData;
}


class MeteoWidget extends HTMLElement {

  protected cityName: string = "paris";
  
  protected root: ShadowRoot;
  protected $cityName: HTMLElement;
  protected $currentConditionLabel: HTMLElement;
  protected $currentTemp: HTMLElement;
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
  
    this.updateForecastView(data);
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
  
  protected createForecastItemHtml(data: IForecastDayData, dayNum: number): string {
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
  
  protected handleError(err: Error): void {
    console.error(err);
  }

  static TEMPLATE: string = `
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
}

customElements.define('meteo-widget', MeteoWidget);