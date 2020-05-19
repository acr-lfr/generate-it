export interface WeatherFull {
  base?: string;
  cod?: number;
  coord: Coord;
  dt?: number;
  id?: string;
  main?: Main;
  name: string;
  sys?: Sys;
  weather?: Weather[];
  wind?: Wind;
}

export interface Coord {
  lat?: number;
  lon?: number;
}

export interface Main {
  grnd_level?: number;
  humidity?: number;
  pressure?: number;
  sea_level?: number;
  temp?: number;
  temp_max?: number;
  temp_min?: number;
}

export interface Sys {
  country?: string;
  message?: number;
  sunrise?: number;
  sunset?: number;
}

export interface Weather {
  description?: string;
  icon?: string;
  id?: number;
  main?: string;
}

export interface Wind {
  clouds?: Clouds;
  deg?: number;
  speed?: number;
}

export interface Clouds {
  all?: number;
}
