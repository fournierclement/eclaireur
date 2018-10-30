const {Character, saveCharacter } = require('./character');

module.exports = {
  "YesIntent": function(){
    let character_name = this.getSessionAttribute('character_name');
    let character = new Character({name: character_name});
    saveCharacter(this.user(), character);
    this.followUpState("OpenedCharacter")
      .ask(`Le personnage de ${character_name} vient d'être ajouté à votre collection. ${character.promptTODO}`)
  },
  "NoIntent": function(){
    this.toIntent("AMAZON.CancelIntent");
  },
  'Unhandled': function(){
    this.toIntent("AMAZON.HelpIntent");
  },
  "AMAZON.HelpIntent": function () {
    let character_name = this.getSessionAttribute('character_name');
    this.followUpState(this.getState())
    .ask(`Voulez-vous créer le personnage de ${character_name} ?`)
  },
  "AMAZON.CancelIntent": function () {
    this.setSessionAttribute("character_name", undefined);
    this.followUpState(null)
    .toIntent("Unhandled");
  },
  "AMAZON.StopIntent": function () {
    this.tell("Création de personnage annulée, bonne journée.")
  },
}