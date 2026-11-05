// items: [color, isCorrect]. Every question has its own type and exactly one filter.
// type: "match" (pick 1 color), "circles" (circles on tiles), "odd" (different tile), "tiles" (color tiles)
const QUESTIONS = [
  {
    type: "match", filter: "achromatopsia", time: 25,
    prompt: "Match the following color",
    reference: "#d46a6a",
    items: [["#d46a6a",1],["#62a862",0],["#6a8ae0",0],["#c07c4a",0]]
  },
  {
    type: "circles", filter: "deuteranopia", time: 20, cols: 3, bg: "#c9b87c",
    prompt: "Select all tiles with <strong>red</strong> circles",
    items: [["#c0392b",1],["#7d9a2e",0],["#c4412f",1],["#8aa23a",0],["#6f8f2a",0],["#b83a2a",1],["#9a8a2a",0],["#7a9a3a",0],["#88902a",0]]
  },
  {
    type: "odd", filter: "protanopia", time: 20, cols: 2,
    prompt: "Select the different color",
    items: [["#7f8c5a",0],["#7f8c5a",0],["#7f8c5a",0],["#948858",1]]
  },
  {
    type: "tiles", filter: "tritanopia", time: 20, cols: 3,
    prompt: "Select all the <strong>yellow</strong> tiles",
    items: [["#f2d94e",1],["#ff8795",0],["#4f8d9d",0],["#b0f0ea",0],["#ead04a",1],["#f2808c",0],["#d8b8c8",0],["#f5dc5a",1],["#ff8a98",0]]
  },
  {
    type: "tiles", filter: "protanopia", time: 20, cols: 3,
    prompt: "Select all the <strong>green</strong> tiles",
    items: [["#5fa83a",1],["#b8472f",0],["#d4b82a",0],["#c8772f",0],["#6bb04a",1],["#fff0c2",0],["#e0a030",0],["#4f9d3a",1],["#d9382b",0]]
  }
];

// Info shown in the result overlay, per type of color blindness
const VARIANTS = {
  protanopia: {
    name: "Protanopia", sub: "Red-Green color blindness (red weak/blind)",
    fact: "About 8% of men are colorblind, most often with red-green color blindness.",
    meaning: "With Protanopia, you have a reduced ability to see red colors. Reds can appear darker or more like brown, green, or grey. It can also be difficult to distinguish between red and green shades.",
    hard: ["Telling the difference between red and green.", "Recognizing red warning lights or indicators.", "Reading charts that use red and green to show different information."]
  },
  deuteranopia: {
    name: "Deuteranopia", sub: "Red-Green color blindness (green weak/blind)",
    fact: "Red-green color blindness is the most common type, and green-weak forms are its most frequent variant.",
    meaning: "With Deuteranopia, the eyes can't detect green light well. Reds and greens both shift toward similar yellow-brown tones, so they are hard to tell apart.",
    hard: ["Telling red, green and brown apart.", "Judging whether fruit is ripe.", "Reading maps and charts that rely on red and green."]
  },
  tritanopia: {
    name: "Tritanopia", sub: "Blue-Yellow color blindness (blue weak/blind)",
    fact: "Blue-yellow color blindness is rare and affects men and women about equally.",
    meaning: "With Tritanopia, you have a reduced ability to see blue light. Blue and green can look alike, and yellow can look pale pink or light grey.",
    hard: ["Telling blue and green apart.", "Telling yellow and pink apart.", "Reading charts that use blue and yellow shades."]
  },
  achromatopsia: {
    name: "Achromatopsia", sub: "Total color blindness (monochromacy)",
    fact: "Achromatopsia is very rare: it affects roughly 1 in 30,000 people.",
    meaning: "With Achromatopsia, you see the world in shades of grey. Colors that have the same brightness look identical, however different they seem to others.",
    hard: ["Telling colors apart when they have similar brightness.", "Reading color-coded information such as maps or graphs.", "Dealing with bright light, which is often uncomfortable."]
  }
};