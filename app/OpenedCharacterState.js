const { getCharacter } = require('./character');

module.exports = {
  "addSkillPoints": function () {
    this.followUpState(this.getState() + '.SkillState')
    .toIntent("addSkillPoints");
  },
  'MakeClassIntent': function () {
    this.followUpState(this.getState() + '.ClassState')
    .toIntent('MakeClassIntent')
  },
  'LevelUpIntent': function () {
    this.followUpState(this.getState() + '.ClassState')
    .toIntent("LevelUpIntent")
  },
  "DescriptionClass" : function () {
    let character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
    var prompt = "";
    if (character.race && character.classes.length > 0) {
      prompt = character.name + " est un " + character.race + " ayant pour classes : " + character.classes.map(e => e.className + " niveau " + e.level + ",") + " besoin d'autre chose ?"
    }
    else if (character.race) {
      prompt = character.name + " est un " + character.race + ". Vous n'avez pas encore choisis de classe. Besoin d'autre chose ?"
    }
    else if (character.classes.length > 0){
      prompt = character.name + "n'a pas encore de race attribuée. Il a pour classes : " + character.classes.map(e => e.className + " niveau " + e.level + ",") + " besoin d'autre chose ?"
    }
    else {
      prompt = character.name + " n'a pas encore de race ni de classe attribuée."
    }
    this.ask(prompt);
  },
  "Unhandled": function () {
    let character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
    let prompt = `Vous travaillez sur ${character.name}<break time="1s"/>. ${character.promptTODO}`;
    this
    .followUpState(this.getState())
    .ask(prompt);
  },

  "ClassState": require("./ClassState"),
  "SkillState": require("./SkillState"),
}