const character = require("./character");

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
  "Unhandled": function () {
    let prompt = `Vous travaillez sur ${this.getSessionAttribute("character_name")}<break time="1s"/>. ${character.characterTODO()}`;
    this
    .followUpState(this.getState() + '.SkillState')
    .ask(prompt);
  },

  "ClassState": require("./ClassState"),
  "SkillState": require("./SkillState"),
}