const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tournamentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    banner: {
      type: String,
    },
    logo: {
      type: String,
    },
    title: {
      type: String,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      index: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    prize: {
      type: mongoose.Schema.Types.Mixed,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    status: {
      type: String,
      default: '0',
    },
    dateString: {
      type: String,
      default: '0',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tournamentSchema.plugin(toJSON);
tournamentSchema.plugin(paginate);

// {
//   "type": "monthly",
//   "title": "Prix du mois, 22 May 2023",
//   "endDate": "2023-05-31T00:00:00.246+00:00",
//   "prize": {
//     "title": "SMARTPHONE SAMSUNG GALAXY A04 3GO 32GO - CUIVRE",
//     "description": "Émergez-vous dans une expérience encore plus immersive avec l'écran Infinity-V de 6,5 pouces du nouveau Galaxy A04. Symétrie éblouissante et élégante. Le nouveau design Ambient Edge combine des bords magnifiquement incurvés avec un dos brillant qui se sent bien dans la main.",
//     "logo": "/assets/images/brands/mini.png"
//   }
// }

/**
 * @typedef Tournament
 */
const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
