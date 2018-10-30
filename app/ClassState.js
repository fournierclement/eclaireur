const {getCharacter, saveCharacter} = require("./character");

const classCompetences = {
  "mage" : [
    "air",
    "terre",
    "eau",
    "feu",
    "abjuration"
  ],
  "guerrier" : [
    "bâton",
    "poignard",
    "marteau",
    "arme naturelle",
    "lance",
    "arme double",
    "lame lourde",
    "lame légère",
    "arme de moine",
    "katana",
    "arme de jet",
    "hache",
    "arme de combat rapproché",
    "fouet",
    "arme d'hast",
    "arme a feu",
    "fléau",
    "engin de siège",
    "arc",
    "cimeterre",
    "arbalète"
  ],
  "prêtre" : [
    "guerre",
    "guérison",
    "artisanat",
    "air"
  ]
}

var speechOutput = '';

module.exports = {
'MakeClassIntent': function () {
  const character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
  let classNameSlot = this.getInput("className") && this.getInput("className").key;
  //delegate to Alexa to collect all the required slot values
  if (!this.alexaSkill().isDialogCompleted()) {
    this.alexaSkill().dialogDelegate();
  } else if(
    this.alexaSkill().isDialogCompleted() && 
    (!classNameSlot === "guerrier" && 
    !this.alexaSkill().hasSlotValue('ecoleMagique') &&
    !this.alexaSkill().hasSlotValue('domaine'))
  ){
    this.alexaSkill().dialogElicitSlot(character.getCapacityFromClass(classNameSlot), character.getCapacityPromptFromClass(classNameSlot))
} else {
    if(character.classLevel(classNameSlot) == 0 ){
      character.levelUpClass(classNameSlot, true);
      speechOutput =  character.name + " est maintenant " + classNameSlot + " de niveau " + character.classLevel(classNameSlot) + "." ;
      if (this.alexaSkill().hasSlotValue("typeArme") && this.getInput("typeArme").key) { character.addFeature({ name: "Entrainement aux armes", option: this.getInput("typeArme").key, class : true, bonusExt : 0})}
      if (this.alexaSkill().hasSlotValue("ecoleMagique")  && this.getInput("ecoleMagique").key) { character.addFeature({ name: "Ecole de magie", option: this.getInput("ecoleMagique").key, class : true, bonusExt : 0})}
      if (this.alexaSkill().hasSlotValue("domaine")  && this.getInput("domaine").key) { character.addFeature({ name: "Domaine de prêtre", option: this.getInput("domaine").key, class : true, bonusExt : 0})}
      saveCharacter(this.user(), character);
    } else {
      speechOutput = character.name + " est déjà un " + classNameSlot + " niveau " + character.classLevel(classNameSlot) + ". Voulez vous faire autre chose ?"
    }
    //Your custom intent handling goes here
    this.ask(speechOutput)
    }
  },
  'LevelUpIntent': function () {

    const character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
    //delegate to Alexa to collect all the required slot values
    if (!this.alexaSkill().isDialogCompleted()) {
      this.alexaSkill().dialogDelegate();
    } else {
      let classNameSlot = this.getInput("className").key;
      let classLevel = character.levelUpClass( classNameSlot );
      let capacity = character.getCapacityFromClass(classNameSlot);
      if(capacity) {
        this.alexaSkill().dialogElicitSlot(character.getCapacityFromClass(classNameSlot), character.getCapacityPromptFromClass(classNameSlot))
      }
      else 
      {
        if (this.alexaSkill().hasSlotValue("typeArme") && this.getInput("typeArme").key) { character.addFeature({ name: "Entrainement aux armes", option: this.getInput("typeArme").key, class : true, bonusExt : 0})}
        if (this.alexaSkill().hasSlotValue("ecoleMagique")  && this.getInput("ecoleMagique").key) { character.addFeature({ name: "Ecole de magie", option: this.getInput("ecoleMagique").key, class : true, bonusExt : 0})}
        if (this.alexaSkill().hasSlotValue("domaine")  && this.getInput("domaine").key) { character.addFeature({ name: "Domaine de prêtre", option: this.getInput("domaine").key, class : true, bonusExt : 0})}
        saveCharacter(this.user(), character);
        speechOutput = "Votre " + classNameSlot + " est maintenant niveau " + classLevel + ". Besoin d'autre chose ?";
        this.ask(speechOutput)
      }
      //Your custom intent handling goes here

    }
  },
  "AMAZON.CancelIntent": function() {
    this.followUpState("OpenedCharacter")
    .toIntent("Unhandled");
  },
  "AMAZON.StopIntent": function() {
    this.tell("Vos modifications ont bien étées prises en compte. A bientôt !")
  },
  "AMAZON.HelpIntent": function() {
    this.ask("D'ici, vous pouvez ajouter des classes à votre personnage ou les monter de niveau.")
  },
}