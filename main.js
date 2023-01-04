import { syllable } from "https://esm.sh/syllable@5?bundle";

let sound = new Howl({
  src: ["mrgrizz.mp3"],
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

const button = document.querySelector("button");
const input = document.querySelector(".input");
const text = document.querySelector("p");

button.addEventListener("click", () => {
  text.innerHTML = ""
  playText(input.value);
});

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
        text.innerHTML += sentenceTab[counterFor].word + " ";
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
