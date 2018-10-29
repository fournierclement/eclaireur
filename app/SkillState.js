const {getCharacter, saveCharacter} = require("./character");

const skillTypes = {
  "compétences sociales": [
    "le bluff",
    "le déguisement",
    "la diplomatie",
    "l'estimation",
    "le folklore local",
    "l'intimidation",
    "la linguistique",
    "la psychologie",
  ],
  "compétences physiques": [
    "l'acrobatie",
    "la discrétion",
    "l'équitation",
    "l'escalade",
    "l'évasion",
    "la natation",
    "le vol",
  ],
  "compétences utilitaires": [
    "le déguisement",
    "la disrétion",
    "le dressage",
    "l'escamotage",
    "l'estimation",
    "la perception",
    "les premiers secours",
    "le sabotage", 
    "la survie",
    "l'utilisation d'objets magiques"
  ],
  "compétences de connaissances": [
    "l'art de la magie",
    "l'exploration souterraine",
    "le folklore local",
    "la géographie",
    "l'histoire",
    "l'ingénierie",
    "les mystères",
    "la nature",
    "la noblesse",
    "les plans",
    "la religion",
    "la linguistique",
  ]
}


module.exports = {
  "addSkillPoints": function () {
    const character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
    const skillPointLeft = character.maxSkillPointSpend - character.skillPointSpend;
    if (this.alexaSkill().hasSlotValue("skill") && this.getInput("skill").key && (
        this.alexaSkill().hasSlotValue("rank_up") ||
        this.alexaSkill().hasSlotValue("to_rank"))
    ) {
      let skill = this.getInput("skill").key;
      let ranks = this.getInput("to_rank").value || (character.skill(skill).rank + this.getInput("rank_up").value);
      character.setRanks(skill, ranks);
      saveCharacter(this.user(), character);
      this.followUpState("OpenedCharacter")
      .ask(`${character.name} a maintenant ${ranks} rangs en ${skill}`)
      
      /**
       * Known Skill provided
      */
    } else if (this.alexaSkill().hasSlotValue("skill") && this.getInput("skill").key) {
      let skill = this.getInput("skill").key;
      this.alexaSkill()
      .dialogElicitSlot(
        'rank_up',
        `${character.name}
        a ${character.skill(skill)} rangs en ${skill} . 
        Combien de points voulez vous investir dans cette compétence ?`);

      /**
       * Known Skill_type provided
       */
    } else if (this.alexaSkill().hasSlotValue("skill_type") && this.getInput("skill_type").key) {
      let skill_type = this.getInput("skill_type").key;
      this.alexaSkill()
      .dialogElicitSlot('skill', `Les ${skill_type} sont ${skillTypes[skill_type].join(", ")} .`);

      /**
       * No skill provided :
       */
    } else {
      this.ask(
        `Il reste ${skillPointLeft} points de compétence à placer,
          vous pouvez les placer dans des compétences physiques,
          sociales,
          utilitaires
          ou bien dans des connaissances.`
      );
    }
  },
  "AMAZON.CancelIntent": function() {
    this.followUpState("OpenedCharacter")
    .toIntent("Unhandled");
  },

  "Unhandled": function() {
    const character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
    const skillPointLeft = character.maxSkillPointSpend - character.skillPointSpend;
    this.ask(
      `Il reste ${skillPointLeft} points de compétence à placer,
        vous pouvez les placer dans des compétences physiques,
        sociales,
        utilitaires
        ou bien dans des connaissances.`
    );
  }
}