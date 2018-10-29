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
    (!this.alexaSkill().hasSlotValue('typeArme') && 
    !this.alexaSkill().hasSlotValue('ecoleMagique') &&
    !this.alexaSkill().hasSlotValue('domaine'))
  ){
    switch(classNameSlot) {
      case "guerrier" :
        this.alexaSkill().dialogElicitSlot('typeArme', 'Quelle compétence en arme votre guerrier souhaite-il acquérir ?');
        break;
      case "mage" :
        this.alexaSkill().dialogElicitSlot('ecoleMagique', 'Quelle école de magie votre mage connait-il ?');
        break;
      case "prêtre" :
        this.alexaSkill().dialogElicitSlot('domaine', 'Quel domaine votre prêtre suit-il ?');
        break;
      case "default" :
        this.ask("Il semble qu'une erreur s'est produite quelque part, veuillez essayer autre chose.")
        break;
    }
  } else {
    if(character.classLevel(classNameSlot) == 0 ){
      character.levelUpClass(classNameSlot, true);
      speechOutput = "La classe " + classNameSlot + " vient d'être ajoutée à votre personnage. vous pouvez maintenant la monter de niveau ou faire autre chose, que voulez vous faire ?";

      //A améliorer
      let typeArmeSlot = this.getInput("typeArme").key;
      let ecoleMagiqueSlot = this.getInput("ecoleMagique").key;
      let domaineSlot = this.getInput("domaine").key;
      if (typeArmeSlot) { character.addFeature({ name: "Entrainement aux armes", option: typeArmeSlot, class : true, bonusExt : 0})}
      if (ecoleMagiqueSlot) { character.addFeature({ name: "Ecole de magie", option: ecoleMagiqueSlot, class : true, bonusExt : 0})}
      if (domaineSlot) { character.addFeature({ name: "Domaine de pêtre", option: domaineSlot, class : true, bonusExt : 0})}
      saveCharacter(this.user(), character);
    } else {
      speechOutput = "La classe " + classNameSlot + " est déjà dans votre personnage. Voulez vous faire autre chose ?"
    }
    //Your custom intent handling goes here
    this.ask(speechOutput);
    }
  },
  'LevelUpIntent': function () {
    const character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
    //delegate to Alexa to collect all the required slot values
    if (!this.alexaSkill().isDialogCompleted()) {
      this.alexaSkill().dialogDelegate();
    } else {
      let classNameSlot = this.getInput("className").key;

      if(character.classLevel(classNameSlot) > 0) {
        let classLevel = character.levelUpClass( classNameSlot );
        saveCharacter(this.user(), character);
        speechOutput = "La classe " + classNameSlot + " vient d'être montée de niveau. Elle est maintenant niveau " + classLevel + ".";
      } else {
        speechOutput = "La classe " + classNameSlot + " n'est pas présente dans votre personnage, commencez par l'ajouter."
      }
      //Your custom intent handling goes here
      this.ask(speechOutput);
    }
  }
}