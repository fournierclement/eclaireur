const rules = require("./rules.json");

const defaultCharacter = {
  name: undefined,
  race: undefined,
  gender: undefined,
  caracteristics: {
    for: 10, const: 10, dex: 10,
    int: 10, sag: 10, cha: 10,
  },
  languages: [],
  classes: [],
  skills: {},
  features: [],
  TODO: {
    race: true,
    gender: true,
    caracteristics: true,
    classes: true
  }
}

class Character {
  constructor(characterJson) {
    let completeJson = {...defaultCharacter, ...characterJson};
    this.name = completeJson.name;
    this.race = completeJson.race;
    this.gender = completeJson.gender;
    this.classes = completeJson.classes;
    this.skills = completeJson.skills;
    this.features = completeJson.features;
    this.caracteristics = completeJson.caracteristics;
    this.languages = completeJson.languages;
    this.TODO = completeJson.TODO;
  }

  /**
   * get caracteristic modifer
   */
  mod(caracteristic){ return Math.floor(( this.caracteristics[caracteristic] - 10 ) / 2 )}

  /**
   * character skill
   */
  skill(skillName){ return this.skills[skillName] || rules[skillName] }
  setRanks(skillName, rank){
    if( !this.skills[skillName] ){
      this.skills[skillName] = {rank:0, class: false};
    }
    this.skills[skillName].rank = rank
  }

  /**
   * get character level
   */
  get level() { return this.classes.reduces((acc, job) => acc + job.level, 0); }
  classLevel(className) {
    let job = this.classes.find(classe => classe.className == className);
    return job ? job.level : 0;
  }
  levelUpClass(className, predilection = false ) {
    let jobIndex = this.classes.findIndex(classe => classe.className == className);
    if (jobIndex < 0) {
      this.classes.push({ className, level: 1, predilection})
      return 1;
    }
    else { return this.classes[jobIndex].level += 1; }
  }

  /**
   * Add a feature to a character
   */
  addFeature(feature){
    this.features.push(feature);
  }

  /**
   * Set the race of a character
   */
  setRace(race_type){
    this.race = race_type;
  }

  /**
   * Set the caracteristics for a character
   */
  setCaracteristics(caracteristics){
    this.caracteristics = {
      for: caracteristics.force,
      dex: caracteristics.dextérité,
      const: caracteristics.constitution,
      int: caracteristics.intelligence,
      sag: caracteristics.sagesse,
      cha: caracteristics.charisme
    };
  }

  /**
   * get character left tasks
   */
  get todo() {
    let todo =  {
      ...this.TODO,
      skills: (this.maxSkillPointSpend - this.skillPointSpend) > 0,
    }
    return (Object.keys(todo).filter(key => todo[key] ) != false) && todo;
  }

  /**
   * get current skill point spend
   */
  get skillPointSpend() {
    return Object
    .keys(this.skills)
    .reduce((acc, skillName) => acc + this.skill(skillName).rank, 0)
  }

  /**
   * get max skill point allowed for this level
   */
  get maxSkillPointSpend(){
    return this.classes.reduce((acc, job) => {
      return acc + ( job.level * (
        rules.classes[job.className].skillByLevel +
        this.mod("int") +
        1 * (job.predilection === 'skill')
      ));
    }, 0);
  }

  /**
   * gets the name of the capacity from the name of the class
   * @param {*} className the name of the class.
   */
  getCapacityFromClass(className){
    let capNumber = "capacity"+ this.classLevel(className);
    let classcap = rules.classes[className];
    return classcap[capNumber]
  }

  /**
   * gets the question to ask the user to get the capacity of the class.
   * @param {*} className the name of the class
   */
  getCapacityPromptFromClass(className){
    let promptNumber = "prompt"+this.classLevel(className);
    let classcap = rules.classes[className];
    return classcap[promptNumber]
  }

  /**
   * prompt toDo
   */
  get promptTODO() {
    let prompt = "";
    if (this.todo) {
      prompt += `Ce personnage a une montée de niveau en cours. Pour finir, `;
      if (this.todo.race) { prompt += "Choisissez une race. "; }
      if (this.todo.gender) { prompt += "Choisissez un genre. "; }
      if (this.todo.classes) { prompt += "Choisissez et complétez sa classe. "; }
      if (this.todo.skills) { prompt += "Ouvrez et Complétez les compétences. "; }
    } else {
      prompt += "Vous pouvez monter de niveau ou modifier son équipement.";
    }
    return prompt;
  }

  get toJSON() {
    let json = {};
    Object.keys(defaultCharacter).forEach(key => json[key] = this[key]);
    return json;
  }
}

const getCharacter = (user, character_name) => {
  if( user.data.characters && user.data.characters[character_name] ){
    return new Character(user.data.characters[character_name]);
  } else {
    return;
  }
}

const saveCharacter = (user, character) => {
  if( !user.characters ){
    user.data.characters = { [character.name]: character};
  } else {
    user.data.characters[character.name] = character;
  }
}

module.exports = {
  getCharacter,
  saveCharacter,
  Character,
};
