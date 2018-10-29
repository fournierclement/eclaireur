const rules = require("./rules.json");

const countSkillSpend = (skills) => Object.keys(skills).reduce((acc, skill) => acc + skills[skill].rank, 0);
const countSkillMax = (character) => character.class.reduce((acc, job) => {
  return job.level * (
    rules.classes[job.className].skillByLevel +
    Math.floor((character.caracteristics.int - 10) / 2) +
    1 * (job.predilection === 'skill')
  )
}, 0);


const character = {
  name: undefined,
  race: undefined,
  gender: undefined,
  class: [{ className: 'mage', level: 3, predilection: 'skill' }],
  skills: {},
  features: [],
  caracteristics: {
    int: 15
  },
  languages: [],
  levelTODO: ["skill", "feats"],
  countSkillMax: () => countSkillMax(character),
  countSkillSpend: () => countSkillSpend(character.skills),
  characterTODO: () => {
    let prompt = "";
    if (character.levelTODO != false) {
      prompt += `Ce personnage a une montée de niveau en cours. Pour finir, `;
      if (character.levelTODO.find(a => "feat")) { prompt += "Ouvrez et Complétez les dons. "; }
      if (character.levelTODO.find(a => "skill")) { prompt += "Ouvrez et Complétez les compétences. "; }

    } else {
      prompt += "Vous pouvez monter de niveau ou modifier son équipement.";
    }
    return prompt;
  }
};

module.exports = character;