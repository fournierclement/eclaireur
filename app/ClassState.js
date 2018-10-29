const character = require("./character");

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
		//delegate to Alexa to collect all the required slot values
        if (!this.alexaSkill().isDialogCompleted()) {
            this.alexaSkill().dialogDelegate();
        }
        else if(this.alexaSkill().isDialogCompleted() && 
            (!this.alexaSkill().hasSlotValue('typeArme') && 
            !this.alexaSkill().hasSlotValue('ecoleMagique') &&
            !this.alexaSkill().hasSlotValue('domaine'))){
            let classNameSlot = this.getInput("className").key;
            switch(classNameSlot) {
                case "guerrier" :
                    this.alexaSkill().dialogElicitSlot('typeArme', 'Quelle compétence en arme votre guerrier souhaite-il acquérir ?');
                case "mage" :
                    this.alexaSkill().dialogElicitSlot('ecoleMagique', 'Quelle école de magie votre mage connait-il ?');
                case "prêtre" :
                    this.alexaSkill().dialogElicitSlot('domaine', 'Quel domaine votre prêtre suit-il ?');
                case "default" :
                    this.ask("Il semble qu'une erreur s'est produite quelque part, veuillez essayer autre chose.")
            }
        }
        else {
            var classe = {className : classNameSlot, level : 1};
            if(!character.class.some(e => e.className === classNameSlot))
            {
                character.class.push(classe);
                speechOutput = "La classe " + classNameSlot + " vient d'être ajoutée à votre personnage. vous pouvez maintenant la monter de niveau ou faire autre chose, que voulez vous faire ?";
                
                //A améliorer
                let typeArmeSlot = this.getInput("typeArme").key;
                let ecoleMagiqueSlot = this.getInput("ecoleMagique").key;
                let domaineSlot = this.getInput("domaine").key;
                if (typeArmeSlot) {character.skills.push({skillName : typeArmeSlot, rank : 1, class : true, bonusExt : 0})}
                if (ecoleMagiqueSlot) {character.skills.push({skillName : ecoleMagiqueSlot, rank : 1, class : true, bonusExt : 0})}
                if (domaineSlot) {character.skills.push({skillName : domaineSlot, rank : 1, class : true, bonusExt : 0})}
            }
            else
            {
                speechOutput = "La classe " + classNameSlot + " est déjà dans votre personnage. Voulez vous faire autre chose ?"
            }
            //Your custom intent handling goes here
            this.ask(speechOutput);
        }
	},
	'LevelUpIntent': function () {
		//delegate to Alexa to collect all the required slot values
        if (!this.alexaSkill().isDialogCompleted()) {
            this.alexaSkill().dialogDelegate();
        }
        else {
            let classNameSlot = this.getInput("className").key;

            if(character.class.some(e => e.className === classNameSlot))
            {
                var updatedClass = character.class.filter(e => e.className === classNameSlot);
                updatedClass[0].level = updatedClass[0].level + 1;
                character.class = character.class.filter(e => e.className !== classNameSlot);
                character.class.push(updatedClass[0]);
                speechOutput = "La classe " + classNameSlot + " vient d'être montée de niveau. Elle est maintenant niveau " + updatedClass[0].level + "."
              }
              else
              {
                  speechOutput = "La classe " + classNameSlot + " n'est pas présente dans votre personnage, commencez par l'ajouter."
            }
            //Your custom intent handling goes here
            this.ask(speechOutput);
        }
    }
}