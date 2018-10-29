'use strict';
const {getCharacter} = require("./character");

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
  "NewCharacter": require("./NewCharacterState"),
  "OpenedCharacter": require("./OpenedCharacterState"),
});

module.exports.app = app;
