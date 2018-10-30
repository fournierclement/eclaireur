const {getCharacter, saveCharacter} = require("./character");

const races = {
  "humain": {
    "vitesse": 9,
    "taille": "moyenne",
    "vision": "normale",
    "langues": ["Commun"],
    "traits": {
      "pointsCompétenceBonus": 1,
      "caractéristiques": {
        "force": 0,
        "dextérité": 0,
        "constitution": 0,
        "intelligence": 0,
        "sagesse": 0,
        "charisme": 0,
        "choisi": 2
      },
      "compétences": {},
    },
  },
  "elfe": {
    "vitesse": 9,
    "taille": "moyenne",
    "vision": "nocturne",
    "langues": ["Commun", "Elfique"],
    "traits": {
      "pointsCompétenceBonus": 0,
      "caractéristiques": {
        "force": 0,
        "dextérité": 2,
        "constitution": -2,
        "intelligence": 2,
        "sagesse": 0,
        "charisme": 0,
        "choisi": 0
      },
      "compétences": {
        "perception": 2,
      },
    },
  },
  "nain": {
    "vitesse": 6,
    "taille": "moyenne",
    "vision": "dans le noir",
    "langues": ["Commun", 'Nain'],
    "traits": {
      "pointsCompétenceBonus": 0,
      "caractéristiques": {
        "force": 0,
        "dextérité": 0,
        "constitution": 2,
        "intelligence": 0,
        "sagesse": 2,
        "charisme": -2,
        "choisi": 0
      },
      "compétences": {
        "estimation": 2,
        "perception": 2
      },
    },
  }
}

module.exports = {
  "ChooseRaceIntent": function () {
    const character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
    if (this.alexaSkill().hasSlotValue("race_type") && this.getInput("race_type").key ) {
      let race = this.getInput("race_type").key;
      character.setRace(race);
      saveCharacter(this.user(), character);
      this.followUpState("OpenedCharacter")
      .ask(`${character.name} a pour race : ${race}`)
    } else {
      this.alexaSkill()
      .dialogElicitSlot('race_type', `Les races disponibles sont ${Object.keys(races).join(", ")}. Veuillez choisir une race.`);
    }
  }
}
