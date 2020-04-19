export interface Weathers {
  data?: Datum[];
  meta?: Meta;
}

export interface Datum {
  cloudCoverPercentage?: number;
  date?: Date;
  humidityPercentage?: number;
  id?: number;
  location?: string;
  temperature?: number;
}

export interface Meta {
  limit?: number;
  offset?: number;
  totalResultCount?: number;
}
