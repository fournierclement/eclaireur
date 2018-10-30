const {Character, saveCharacter } = require('./character');

module.exports = {
  "YesIntent": function(){
    let character_name = this.getSessionAttribute('character_name');
    let character = new Character({name: character_name});
    saveCharacter(this.user(), character);
    this.followUpState("OpenedCharacter")
      .ask(`Le personnage de ${character_name} vient d'être ajouté à votre collection. ${character.promptTODO}`)
  },
  'Unhandled': function(){
    this.ask("ok")
  }
}