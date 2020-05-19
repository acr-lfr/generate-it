export default {
  // weatherGet
  weatherGet: {
    coord: { lon: Number, lat: Number },
    weather: [{ id: Number, main: String, description: String, icon: String }],
    base: String,
    main: {
      temp: Number,
      pressure: Number,
      humidity: Number,
      temp_min: Number,
      temp_max: Number,
      sea_level: Number,
      grnd_level: Number,
    },
    wind: { speed: Number, deg: Number, clouds: { all: Number } },
    dt: Number,
    sys: { message: Number, country: String, sunrise: Number, sunset: Number },
    id: Number,
    name: String,
    cod: Number,
  },

  // weatherIdGet
  weatherIdGet: {
    coord: { lon: Number, lat: Number },
    weather: [{ id: Number, main: String, description: String, icon: String }],
    base: String,
    main: {
      temp: Number,
      pressure: Number,
      humidity: Number,
      temp_min: Number,
      temp_max: Number,
      sea_level: Number,
      grnd_level: Number,
    },
    wind: { speed: Number, deg: Number, clouds: { all: Number } },
    dt: Number,
    sys: { message: Number, country: String, sunrise: Number, sunset: Number },
    id: String,
    name: String,
    cod: Number,
  },
};
