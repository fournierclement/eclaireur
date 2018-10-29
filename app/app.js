'use strict';
const character = require("./character");


// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
  logging: false,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
  'LAUNCH': function() {
    this.followUpState(null)
    .ask("Voulez vous ouvrir un personnage ou bien en créer un nouveau ?");
  },
  'OpenCharacter': function() {
    if (!this.alexaSkill().hasSlotValue('character_name')) {
      this.alexaSkill().dialogElicitSlot("character_name","Quel est le nom du personnage à ouvrir?");
    } else {
      let character_name = this.getInput("character_name").value;
      this.setSessionAttribute("character_name", character_name);
      this.followUpState("OpenedCharacter")
      .ask(`J'ouvre ${character_name} . ${character.characterTODO()}`);
    }
  },

  "OpenedCharacter": require("./OpenedCharacterState"),
});

module.exports.app = app;
