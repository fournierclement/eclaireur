const {Character, saveCharacter } = require('./character');

module.exports = {
  "YesIntent": function(){
    let character = this.getSessionAttribute("newCharacter");
    if (character) {
      this.followUpState(this.getState())
      .toIntent("Unhandled");
    } else {
      let character_name = this.getSessionAttribute('character_name');
      let character = new Character({name: character_name});
      this.setSessionAttribute("newCharacter", character);
      this.followUpState(this.getState())
      .toIntent("Unhandled");
    }
  },
  "NoIntent": function(){
    this.toIntent("AMAZON.CancelIntent");
  },

  "ChooseGender": require("./ChooseGender"),
  "ChooseRaceIntent": require("./RaceState")["ChooseRaceIntent"],
  "RollCaracteristicsIntent": require("./CaracteristicsState")["RollCaracteristicsIntent"],

  'Unhandled': function(){
    let characterJSON = this.getSessionAttribute("newCharacter");
    let character = characterJSON && (new Character(characterJSON));
    if (character && character.todo) {
      let promptTODO = ""
      if (character.todo.race) { promptTODO += ", choisissez une race"; }
      if (character.todo.gender) { promptTODO += ", choisissez un genre"; }
      if (character.todo.caracteristics) { promptTODO += ", lancer ses caracs"; }
      this.followUpState(this.getState())
      .ask(`Pour finir de créer ${character.name}${promptTODO}.`);
    } else if (character && !character.todo) {
      saveCharacter(this.user(), character);
      this.setSessionAttribute('character_name', character.name);
      this.followUpState("OpenedCharacter")
        .ask(`
      Le personnage de ${character.name} vient d'être ajouté dans votre collection,
      vous pouvez désormais lui ajouter une classes ou quitter.
      `)
    } else {
      this.followUpState(null)
        .ask(`Quelque chose s'est mal passé. Déso bye.`);
    }
  },

  "AMAZON.HelpIntent": function () {
    this.followUpState(this.getState())
    .toIntent("Unhandled");
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