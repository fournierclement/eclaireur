const {Character} = require("./character");

const caracteristics = {
  "force": "",
  "dextérité": "",
  "constitution": "",
  "intelligence": "",
  "sagesse": "",
  "charisme": ""
}

/**
 * roll new caracteristic
 */
const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

/**
 * roll new caracteristic
 */
const rollCaracteristic = () => {
  const rollA = (getRandomInt(6)+1);
  const rollB = (getRandomInt(6)+1);
  const rollC = (getRandomInt(6)+1);
  const rollD = (getRandomInt(6)+1);
  return ( (rollA + rollB + rollC + rollD) - (Math.min(rollA, rollB, rollC, rollD)) )
}

module.exports = {
  "RollCaracteristicsIntent": function () {
    const character = new Character(this.getSessionAttribute("newCharacter"));
    if (this.alexaSkill().getIntentConfirmationStatus() !== 'CONFIRMED') {
      const newCaracs = {
        "force" : rollCaracteristic(),
        "dextérité" : rollCaracteristic(),
        "constitution" : rollCaracteristic(),
        "intelligence" : rollCaracteristic(),
        "sagesse" : rollCaracteristic(),
        "charisme" : rollCaracteristic()
      };
      this.setSessionAttribute("caracteristics", newCaracs);
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
      this.alexaSkill().dialogConfirmIntent(
        'Est ce que ces caractéristiques sont satisfaisantes ?'
      );
    } else {
      const caracs = this.getSessionAttribute("caracteristics");
      character.setCaracteristics(caracs);
      this.setSessionAttribute("newCharacter", character.toJSON);
      this.followUpState("NewCharacter")
      .toIntent("Unhandled");
    }
  },
}
