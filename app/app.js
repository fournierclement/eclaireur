'use strict';
const {getCharacter, Character} = require("./character");

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
  logging: false,
  // db: {
  //   type: 'dynamodb',
  //   tableName: 'characters',
  // }
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
  /**
   * On Launch intent
  */
  'LAUNCH': function() {
    this.followUpState(null)
    .ask("Voulez vous ouvrir un personnage ou bien en créer un nouveau ?");
  },
  /**
   * Open a character, ask for the name if not provided.
   */
  'OpenCharacter': function() {
    if (!this.alexaSkill().hasSlotValue('character_name')) {
      this.alexaSkill().dialogElicitSlot("character_name","Quel est le nom du personnage à ouvrir?");
    } else {
      let character_name = this.getInput("character_name").value;
      this.setSessionAttribute("character_name", character_name);
      let character = getCharacter(this.user(), character_name);

      /**
       * Check character exists
       */
      if (character){
        this.followUpState("OpenedCharacter")
        .ask(`J'ouvre ${character_name} . ${character.promptTODO}`);
      } else {
        this.followUpState("NewCharacter")
        .ask(`Le personnage ${character_name} n'existe pas encore. Voulez-vous le créer ?`)
      }
    }
  },

  "createCharacter": function() {
    if(this.alexaSkill().hasSlotValue("character_name")){
      let character_name = this.getInput("character_name").value;
      let character = new Character({name: character_name});
      this.setSessionAttribute("newCharacter", character);
      this.followUpState("NewCharacter")
      .toIntent("Unhandled");
    } else {
      this.alexaSkill().dialogElicitSlot(
        "character_name",
        "Comment voulez-vous appeller votre nouveau personnage?"
      );
    }
  },

  'Unhandled': function(){
    this.toIntent("AMAZON.HelpIntent")
  },
  "AMAZON.HelpIntent": function () {
    let characters = Object.keys(this.user().data.characters || {});
    if( characters != false ){
      this.ask(
        `Vous avez ${characters.length} que voici: ${characters.join(', ')}
        Vous pouvez ouvrir un de ces personnages ou bien en créer un nouveau.`
      );
    } else {
      this.ask(`Vous n'avez pas encore de personnage, n'hésitez pas à en créer un.`);
    }
  },
  "AMAZON.CancelIntent": function () {
    this.toIntent("AMAZON.StopIntent")
  },
  "AMAZON.StopIntent": function () {
    this.tell("Bonne journée.")
  },

  "NewCharacter": require("./NewCharacterState"),
  "OpenedCharacter": require("./OpenedCharacterState"),
});

module.exports.app = app;
