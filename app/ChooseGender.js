const { Character } = require("./character");

module.exports = function() {
  const character = new Character(this.getSessionAttribute("newCharacter"));
  if (this.alexaSkill().hasSlotValue("genderRace") && this.getInput("genderRace").key) {
    let genderRace = this.getInput("genderRace").key;
    let race, gender;
    switch(genderRace){
      case "humaine":
        race = race || "humain";
      case "naine":
        race = race || "nain";
      case "elfette":
        race = race || "elfe";
      case "female":
        gender = "female";
      case "nain":
        race = race || "nain";
      case "elfe":
        race = race || "elfe";
      case "humain":
      case "male":
      case "default":
        race = race || "humain";
        gender = gender || "male";
    }
    if(race) { character.setRace(race); }
      character.setGender(gender);
      this.setSessionAttribute("newCharacter", character.toJSON);
      this.followUpState("NewCharacter")
      .toIntent("Unhandled");
  } else {
    this.alexaSkill().dialogElicitSlot(
      "genderRace",
      "Quel est le genre de votre personnage ?"
    )
  }
}