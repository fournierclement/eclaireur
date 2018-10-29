const character = require("./character");

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
    const skillPointLeft = character.countSkillMax() - character.countSkillSpend();
    if ((this.alexaSkill().hasSlotValue("skill") ||
      this.getSessionAttribute("skill")) && (
        this.alexaSkill().hasSlotValue("rank_up") ||
        this.alexaSkill().hasSlotValue("to_rank"))
    ) {
      let skill = this.alexaSkill().hasSlotValue("skill").key || this.getSessionAttribute("skill");
      let ranks = this.getInput("to_rank").value || "x + " + this.getInput("rank_up").value;
      console.log(this.getInputs());
      this.tell(`${this.getSessionAttribute("character_name")} a maintenant ${ranks} rang en ${skill}`)
    } else if (this.alexaSkill().hasSlotValue("skill")) {
      console.log(this.getInput("skill"));
      this.setSessionAttribute("skill", this.getInput("skill").key);
      this.ask(`
        ${this.getSessionAttribute("character_name")}
        a x rangs en ${this.getSessionAttribute("skill")} . 
        Combien de points voulez vous investir dans cette compétence ?`);
    } else if (this.alexaSkill().hasSlotValue("skill_type")) {
      console.log(this.getInput("skill_type"));
      
      let skill_type = this.getInput("skill_type").key;
      this.ask(`Les ${skill_type} sont ${skillTypes[skill_type].join(", ")} .`);
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
  "Unhandled": function() {
    const skillPointLeft = character.countSkillMax() - character.countSkillSpend();
    this.ask(
      `Il reste ${skillPointLeft} points de compétence à placer,
        vous pouvez les placer dans des compétences physiques,
        sociales,
        utilitaires
        ou bien dans des connaissances.`
    );
  }
}