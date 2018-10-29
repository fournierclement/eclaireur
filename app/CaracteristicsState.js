const character = require("./character");
const {getCharacter, saveCharacter} = require("./character");

const caracteristics = {
  "force": ,
  "dextérité": ,
  "constitution": ,
  "intelligence": ,
  "sagesse": ,
  "charisme":
}

  /**
   * roll new caracteristic
   */
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * roll new caracteristic
   */
   rollCaracteristic(){
     const rollA = (getRandomInt(6)+1);
     const rollB = (getRandomInt(6)+1);
     const rollC = (getRandomInt(6)+1);
     const rollD = (getRandomInt(6)+1);
     return ( (rollA + rollB + rollC + rollD) - (Math.min(rollA, rollB, rollC, rollD)) )
   }

module.exports = {
  "RollCaracteristicsIntent": function () {
    const character = getCharacter(this.user(), this.getSessionAttribute("character_name"));
    const newCaracs = {
      "force" : rollCaracteristic(),
      "dextérité" : rollCaracteristic(),
      "constitution" : rollCaracteristic(),
      "intelligence" : rollCaracteristic(),
      "sagesse" : rollCaracteristic(),
      "charisme" : rollCaracteristic()
    };
    // Prompt voici les caractéristiques que j'ai roll pour Vous
    this.ask(
      `Vos caractéristiques sont les suivantes.
      Votre force est de ${newCaracs.force}.
      Votre dextérité est de ${newCaracs.dextérité}.
      Votre constitution est de ${newCaracs.constitution}.
      Votre intelligence est de ${newCaracs.intelligence}.
      Votre sagesse est de ${newCaracs.sagesse}.
      Votre charisme est de ${newCaracs.charisme}.`
    );
    // Voulez vous les garder
    // TODO: 
  },
}
