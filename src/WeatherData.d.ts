export type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type DayShort = "Lun." | "Mar." | "Mer." | "Jeu." | "Ven." | "Sam." | "Dim.";
export type DayLong = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche";
export type Condition = "Ensoleillé" 
  | "Nuit claire"
  | "Ciel voilé"
  | "Nuit légèrement voilée"
  | "Faibles passages nuageux"
  | "Nuit bien dégagée"
  | "Brouillard"
  | "Stratus"
  | "Stratus se dissipant"
  | "Nuit claire et stratus"
  | "Eclaircies"
  | "Nuit nuageuse"
  | "Faiblement nuageux"
  | "Fortement nuageux"
  | "Averses de pluie faible"
  | "Nuit avec averses"
  | "Averses de pluie modérée"
  | "Averses de pluie forte"
  | "Couvert avec averses"
  | "Pluie faible"
  | "Pluie forte"
  | "Pluie modérée"
  | "Développement nuageux"
  | "Nuit avec développement nuageux"
  | "Faiblement orageux"
  | "Nuit faiblement orageuse"
  | "Orage modéré"
  | "Fortement orageux"
  | "Averses de neige faible"
  | "Nuit avec averses de neige faible"
  | "Neige faible"
  | "Neige modérée"
  | "Neige forte"
  | "Pluie et neige mêlée faible"
  | "Pluie et neige mêlée modérée"
  | "Pluie et neige mêlée forte";

export type ConditionKey = "ensoleille"
    | "nuit-claire"
    | "ciel-voile"
    | "nuit-legèrement-voilee"
    | "faibles-passages-nuageux"
    | "nuit-bien-degagee"
    | "brouillard"
    | "stratus"
    | "stratus-se-dissipant"
    | "nuit-claire-et-stratus"
    | "eclaircies"
    | "nuit-nuageuse"
    | "faiblement-nuageux"
    | "fortement-nuageux"
    | "averses-de-pluie-faible"
    | "nuit-avec-averses"
    | "averses-de-pluie-moderee"
    | "averses-de-pluie-forte"
    | "couvert-avec-averses"
    | "pluie-faible"
    | "pluie-forte"
    | "pluie-moderee"
    | "developpement-nuageux"
    | "nuit-avec-developpement-nuageux"
    | "faiblement-orageux"
    | "nuit-faiblement-orageuse"
    | "orage-modere"
    | "fortement-orageux"
    | "averses-de-neige-faible"
    | "nuit-avec-averses-de-neige-faible"
    | "neige-faible"
    | "neige-moderee"
    | "neige-forte"
    | "pluie-et-neige-melee-faible"
    | "pluie-et-neige-melee-moderee"
    | "pluie-et-neige-melee-forte";

export interface ICityInfoData {
  name: string;
  country: string;
  latitude: string;
  longitude: string;
  elevation: string;
  sunrise: string;
  sunset: string;
}

export interface IForecastInfoData {
  latitude: string | null;
  longitude: string | null;
  elevation: string;
}

export interface ICurrentConditionsData {
  date: string;
  hour: string;
  tmp: number;
  wnd_spd: number;
  wnd_gust: number;
  wnd_dir: WindDirection;
  pressure: number;
  humidity: number;
  condition: Condition;
  condition_key: ConditionKey;
  icon: string;
  icon_big: string;
}

export interface IForecastHourData {
  ICON: string;
  CONDITION: Condition;
  CONDITION_KEY: ConditionKey;
  TMP2m: number;
  DPT2m: number;
  WINDCHILL2m: number;
  HUMIDEX: number;
  RH2m: number;
  APCPsfc: number;
  WNDSPD10m: number;
  WNDGUST10m: number;
  WNDDIR10m: number;
  WNDDIRCARD10: WindDirection;
  ISSNOW: number;
  HCDC: string;
  MCDC: string;
  LCDC: string;
  HGT0C: number;
  KINDEX: number;
  CAPE180_0: string;
  CIN180_0: number;
}

export interface IHourlyData {
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

export interface IForecastDayData {
  date: string;
  day_short: DayShort;
  day_long: DayLong;
  tmin: number;
  tmax: number;
  condition: Condition;
  condition_key: ConditionKey;
  icon: string;
  icon_big: string;
  hourly_data: IHourlyData;
}

export interface IWeatherData{
  city_info: ICityInfoData;
  forecast_info: IForecastInfoData;
  current_condition: ICurrentConditionsData;
  fcst_day_0: IForecastDayData;
  fcst_day_1: IForecastDayData;
  fcst_day_2: IForecastDayData;
  fcst_day_3: IForecastDayData;
  fcst_day_4: IForecastDayData;
}