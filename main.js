import { syllable } from "https://esm.sh/syllable@5?bundle";

let sound = new Howl({
  src: ["sound/mrgrizz.mp3"],
  sprite: {
    voice0: [350, 200],
    voice1: [650, 150],
    voice2: [850, 200],
    voice3: [1050, 200], //f
    voice4: [1250, 200], //f
    voice5: [1500, 200],
    voice6: [1700, 250],
    voice7: [2000, 200],
    voice8: [2250, 175],
    voice9: [2450, 260],
    voice10: [2700, 250],
    voice11: [2950, 200],
    voice12: [3200, 200],
    voice13: [3450, 300], //b
    voice14: [3750, 200], //b
    voice15: [3950, 150],
    voice16: [4150, 300], //b
    voice17: [4450, 200],
    all: [0],
  },
});

const spriteDurations = [
  200, 150, 200, 150, 200, 200, 200, 200, 175, 260, 200, 200, 200, 200, 150,
  150, 200, 200,
];

const mrGrizzQuotes = [
  "Salmonoboss en approche. AU BOULOT !",
  "Allez, les petits œufs, venez voir papa... Tu t'en sors pas trop mal pour le moment... MAINTENANT, VA EN CHERCHER D'AUTRES !",
  "Le panier à œufs attend que tu le remplisses. C'est pas le moment de flancher.",
  "Un banc de Salmonoïdes est en train de se rassembler sur la côte. Faites-en autant et canardez-moi ça.",
  "Le panier à œufs est prêt. On a une ville à protéger, alors au boulot ! Et me décevez pas !",
  "Je vais pas tourner autour du pot : ça grouille de Salmonoïdes. On reste concentré sur l'objectif et on avance. J'espère que tout le monde a pris son café...",
  "Un Vaisseau mère. Allumez-le à plusieurs. Et le premier qui parle de prime de risque est VIRÉ.",
  "Il y a un vieux proverbe sur les Salmonoïdes de boue... « Si t'en vois un jaillir en trombe, dans sa grande gueule envoie une bombe. » Oui, c'est un proverbe assez technique.",
  "Salmonarque en approche, et donc heures sup obligatoires au programme. Voici un canon à œufs, à vous de jouer !",
  "Y a des Sumoches sur la côte. Et des canons à disposition. Je te laisse deviner la suite.",
  "Une tornade géante ! Les Salmonoïdes qu'elle engloutira seront projetés sur le rivage. Oh, et le panier à œufs au bord de l'eau est bloqué aussi. C'est la fête...",
  "Le brouillard rapplique. C'est pas bon... Mais perds pas espoir, il s'agit de rester concentré.",
  "Un Barkeurk... Sa queue n'est pas blindée, allume-la et il fera pas long feu.",
  "Des jets d'encre... Le Dorax doit pas être loin ! Chope-le, encre-le, et fait-lui lâcher ses œufs !",
];

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const button = document.querySelector(".input-button");
const buttonQuote = document.querySelector(".input-quote");
const input = document.querySelector(".input");
const text = document.querySelector(".dialog");

button.addEventListener("click", () => {
  text.innerHTML = "";
  playText(input.value);
});

buttonQuote.addEventListener("click", () => {
  text.innerHTML = "";
  const selectedQuote = mrGrizzQuotes[randomInt(0, mrGrizzQuotes.length - 1)];
  //input.value = selectedQuote
  playText(selectedQuote);
});

input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    text.innerHTML = "";
    playText(input.value);
  }
});

let counter = 0;

const playText = (sentence) => {
  const sentenceWords = sentence.split(" ");
  const sentenceTab = [];

  const testIsEndSentence = (word) => {
    return word.slice(-1) == "." || word.includes("!") || word.includes("?");
  };

  const generateSoundInfos = (nbSyllabes) => {
    const soundInfos = {
      idSounds: [],
      delays: [],
    };

    for (let i = 0; i < nbSyllabes; i++) {
      const id = randomInt(0, 17);
      soundInfos.idSounds.push(id);
      soundInfos.delays.push(spriteDurations[id] - 100);
    }

    return soundInfos;
  };

  for (let i = 0; i < sentenceWords.length; i++) {
    const wordSyllabes = syllable(sentenceWords[i]);
    const soundInfos = generateSoundInfos(wordSyllabes);

    sentenceTab.push({
      word: sentenceWords[i],
      syllabes: wordSyllabes,
      endSentence: testIsEndSentence(sentenceWords[i]),
      idSounds: soundInfos.idSounds,
      delays: soundInfos.delays,
    });
  }

  const totalDelay = (arrayDelay) => {
    return arrayDelay.reduce((a, b) => a + b, 0);
  };

  let counterFor = 0;

  const getMinusOneElementArray = (index) => {
    return index > 0 ? index - 1 : index;
  };

  const playDialogue = (counterMax, wordInfo) => {
    if (counter < counterMax) {
      sound.play(`voice${wordInfo.idSounds[counter]}`);

      setTimeout(() => {
        playDialogue(counterMax, wordInfo);
      }, wordInfo.delays[counter]);

      counter++;
    }
  };

  const loopPhrase = () => {
    setTimeout(
      () => {
        const counterMax = sentenceTab[counterFor].syllabes;
        text.insertAdjacentHTML(
          "beforeend",
          `<span class="fade-in">${sentenceTab[counterFor].word}</span> `
        );
        playDialogue(counterMax, sentenceTab[counterFor]);

        counter = 0;
        counterFor++;
        if (counterFor < sentenceTab.length) {
          loopPhrase();
        }
      },
      sentenceTab[getMinusOneElementArray(counterFor)].endSentence
        ? 500 +
            totalDelay(sentenceTab[getMinusOneElementArray(counterFor)].delays)
        : 50 +
            totalDelay(sentenceTab[getMinusOneElementArray(counterFor)].delays)
    );
  };

  loopPhrase();
};
