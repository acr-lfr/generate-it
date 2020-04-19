export default {
  // weatherGet
  weatherGet: {
    meta: { totalResultCount: Number, offset: Number, limit: Number },
    data: [
      {
        id: Number,
        date: String,
        location: String,
        cloudCoverPercentage: Number,
        humidityPercentage: Number,
        temperature: Number,
      },
    ],
  },

  // weatherPost
  weatherPost: {
    id: Number,
    date: String,
    location: String,
    cloudCoverPercentage: Number,
    humidityPercentage: Number,
    temperature: Number,
  },

  // weatherIdGet
  weatherIdGet: {
    id: Number,
    date: String,
    location: String,
    cloudCoverPercentage: Number,
    humidityPercentage: Number,
    temperature: Number,
  },

  // weatherIdPut
  weatherIdPut: {
    id: Number,
    date: String,
    location: String,
    cloudCoverPercentage: Number,
    humidityPercentage: Number,
    temperature: Number,
  },
};
