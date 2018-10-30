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