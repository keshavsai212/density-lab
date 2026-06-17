const topicCards = document.querySelectorAll(".topic-card");

topicCards.forEach((card) => {
  card.addEventListener("click", () => {
    topicCards.forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
  });
});

const materials = [
  { name: "Cork", mass: 12, volume: 50, color: "#f2c14e" },
  { name: "Wood", mass: 35, volume: 50, color: "#c98b55" },
  { name: "Plastic", mass: 95, volume: 100, color: "#8fd6c3" },
  { name: "Ice", mass: 46, volume: 50, color: "#d7f3ff" },
  { name: "Oil", mass: 45, volume: 50, color: "#e8b14f" },
  { name: "Aluminium", mass: 135, volume: 50, color: "#b8c2cc" },
  { name: "Iron", mass: 393.5, volume: 50, color: "#8b949e" },
  { name: "Stone", mass: 130, volume: 50, color: "#a49687" },
  { name: "Gold", mass: 386, volume: 20, color: "#f0b429" },
];

const waterDensity = 1;
const materialPicker = document.querySelector("#material-picker");
const materialName = document.querySelector("#material-name");
const materialMass = document.querySelector("#material-mass");
const materialVolume = document.querySelector("#material-volume");
const materialDensity = document.querySelector("#material-density");
const materialResult = document.querySelector("#material-result");
const simExplanation = document.querySelector("#sim-explanation");
const simObject = document.querySelector("#sim-object");
const replayButton = document.querySelector("#replay-button");
const simTank = document.querySelector(".sim-tank");
const densityForm = document.querySelector("#density-form");
const densityAnswer = document.querySelector("#density-answer");
const calculationStatus = document.querySelector("#calculation-status");

let selectedMaterial = materials[0];
let experimentUnlocked = false;

function getDensity(material) {
  return material.mass / material.volume;
}

function getBehavior(material) {
  const density = getDensity(material);

  if (Math.abs(density - waterDensity) <= 0.05) {
    return "suspend";
  }

  return density < waterDensity ? "float" : "sink";
}

function getResultLabel(behavior) {
  if (behavior === "float") return "Floats";
  if (behavior === "sink") return "Sinks";
  return "Stays suspended";
}

function getExplanation(material, behavior) {
  const density = getDensity(material).toFixed(2);

  if (behavior === "float") {
    return `${material.name} has a density of ${density} g/cm3, so it floats because its density is less than water.`;
  }

  if (behavior === "sink") {
    return `${material.name} has a density of ${density} g/cm3, so it sinks because its density is greater than water.`;
  }

  return `${material.name} has a density of ${density} g/cm3, so it stays suspended because its density is very close to water.`;
}

function replayAnimation() {
  if (!experimentUnlocked) return;

  const behavior = getBehavior(selectedMaterial);

  simObject.className = "sim-object";
  simTank.classList.remove("is-splashing");

  requestAnimationFrame(() => {
    simObject.classList.add(behavior);
    simTank.classList.add("is-splashing");
  });
}

function selectMaterial(material) {
  selectedMaterial = material;
  experimentUnlocked = false;

  materialName.textContent = material.name;
  materialMass.textContent = `${material.mass} g`;
  materialVolume.textContent = `${material.volume} cm3`;
  materialDensity.textContent = "Locked";
  materialResult.textContent = "Locked";
  simExplanation.textContent = "Calculate the density first, then run the water test.";
  simObject.textContent = material.name;
  simObject.style.background = material.color;
  simObject.className = "sim-object ready";
  replayButton.textContent = "Run Experiment";
  replayButton.disabled = true;
  densityAnswer.value = "";
  calculationStatus.className = "calculation-status";
  calculationStatus.textContent = "Enter your answer before the experiment starts.";
  simTank.classList.remove("is-splashing");

  document.querySelectorAll(".material-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.material === material.name);
  });
}

materials.forEach((material) => {
  const button = document.createElement("button");
  button.className = "material-button";
  button.type = "button";
  button.dataset.material = material.name;
  button.textContent = material.name;
  button.addEventListener("click", () => selectMaterial(material));
  materialPicker.append(button);
});

replayButton.addEventListener("click", replayAnimation);
densityForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const studentAnswer = Number(densityAnswer.value);
  const density = getDensity(selectedMaterial);
  const behavior = getBehavior(selectedMaterial);
  const isCorrect = Number.isFinite(studentAnswer) && Math.abs(studentAnswer - density) <= 0.02;

  if (!isCorrect) {
    calculationStatus.className = "calculation-status is-incorrect";
    calculationStatus.textContent = `Try again: divide ${selectedMaterial.mass} by ${selectedMaterial.volume}.`;
    materialDensity.textContent = "Locked";
    materialResult.textContent = "Locked";
    simExplanation.textContent = "The experiment stays locked until the density is calculated correctly.";
    replayButton.disabled = true;
    return;
  }

  experimentUnlocked = true;
  calculationStatus.className = "calculation-status is-correct";
  calculationStatus.textContent = "Correct. Now watch the experiment.";
  materialDensity.textContent = `${density.toFixed(2)} g/cm3`;
  materialResult.textContent = getResultLabel(behavior);
  simExplanation.textContent = getExplanation(selectedMaterial, behavior);
  replayButton.disabled = false;
  replayButton.textContent = "Replay Experiment";
  replayAnimation();
});
selectMaterial(selectedMaterial);
