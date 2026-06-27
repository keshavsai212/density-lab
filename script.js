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
const volumeForm = document.querySelector("#volume-form");
const volumeAnswer = document.querySelector("#volume-answer");
const volumeStatus = document.querySelector("#volume-status");
const displacementCylinder = document.querySelector("#displacement-cylinder");
const replayDisplacement = document.querySelector("#replay-displacement");
const topMeniscus = document.querySelector("#top-meniscus");
const bottomMeniscus = document.querySelector("#bottom-meniscus");
const meniscusReadingStatus = document.querySelector("#meniscus-reading-status");
const readingForm = document.querySelector("#reading-form");
const initialReading = document.querySelector("#initial-reading");
const finalReading = document.querySelector("#final-reading");
const readingStatus = document.querySelector("#reading-status");
const densityConceptForm = document.querySelector("#density-concept-form");
const densityConceptAnswer = document.querySelector("#density-concept-answer");
const densityConceptStatus = document.querySelector("#density-concept-status");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll("[data-panel]");
const tabTriggers = document.querySelectorAll("[data-tab-trigger]");
const bottomHelper = document.querySelector("#bottom-helper");
const resetActivity = document.querySelector("#reset-activity");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("[data-theme-icon]");
const themeLabel = document.querySelector("[data-theme-label]");
const themePreference = window.matchMedia("(prefers-color-scheme: dark)");
const THEME_STORAGE_KEY = "density-theme";

let selectedMaterial = materials[0];
let experimentUnlocked = false;
let activeTab = "home";

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return themePreference.matches ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light" : "Dark";
}

function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
}

themeToggle.addEventListener("click", toggleTheme);

themePreference.addEventListener("change", () => {
  if (!localStorage.getItem(THEME_STORAGE_KEY)) {
    applyTheme(getPreferredTheme());
  }
});

function showTab(tabName) {
  activeTab = tabName;

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.panel === tabName;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  window.history.replaceState(null, "", `#${tabName}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  updateBottomHelper();
}

function getInitialTab() {
  return "home";
}

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

function resetSimulator() {
  selectMaterial(selectedMaterial);
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

tabButtons.forEach((button) => {
  button.addEventListener("click", () => showTab(button.dataset.tab));
});

tabTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => showTab(trigger.dataset.tabTrigger));
});

function updateBottomHelper() {
  const scrollPosition = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  const isNearBottom = pageHeight - scrollPosition < 180;
  const hasScrollablePage = pageHeight > window.innerHeight + 220;

  bottomHelper.classList.toggle("is-visible", isNearBottom && hasScrollablePage);
}

window.addEventListener("scroll", updateBottomHelper, { passive: true });
window.addEventListener("resize", updateBottomHelper);

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

volumeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answer = Number(volumeAnswer.value);

  if (answer === 24) {
    volumeStatus.className = "calculation-status is-correct";
    volumeStatus.textContent = "Correct. The irregular object has a volume of 24 cm3.";
    return;
  }

  volumeStatus.className = "calculation-status is-incorrect";
  volumeStatus.textContent = "Try again: subtract the initial reading from the final reading.";
});

function replayDisplacementExperiment() {
  displacementCylinder.classList.remove("is-replaying");

  requestAnimationFrame(() => {
    displacementCylinder.classList.add("is-replaying");
  });

  meniscusReadingStatus.className = "calculation-status";
  meniscusReadingStatus.textContent = "The object is lowered slowly, so the water rises by the displaced volume.";
}

function resetMeniscusExperiment() {
  initialReading.value = "";
  finalReading.value = "";
  volumeAnswer.value = "";
  readingStatus.className = "calculation-status";
  readingStatus.textContent = "Estimate both readings from the bottom of the meniscus.";
  volumeStatus.className = "calculation-status";
  volumeStatus.textContent = "Use final volume minus initial volume.";
  meniscusReadingStatus.className = "calculation-status";
  meniscusReadingStatus.textContent = "Watch the object lower into the water, then choose the correct place to read.";

  displacementCylinder.classList.remove("is-replaying");
  requestAnimationFrame(() => {
    displacementCylinder.classList.add("is-replaying");
  });
}

replayDisplacement.addEventListener("click", replayDisplacementExperiment);

topMeniscus.addEventListener("click", () => {
  meniscusReadingStatus.className = "calculation-status is-incorrect";
  meniscusReadingStatus.textContent = "Not quite. Reading the top of the curve makes the volume too high.";
});

bottomMeniscus.addEventListener("click", () => {
  meniscusReadingStatus.className = "calculation-status is-correct";
  meniscusReadingStatus.textContent = "Correct. Always read the bottom of the meniscus at eye level.";
});

readingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const initial = Number(initialReading.value);
  const final = Number(finalReading.value);
  const initialCorrect = initial === 40;
  const finalCorrect = final === 65;

  if (initialCorrect && finalCorrect) {
    readingStatus.className = "calculation-status is-correct";
    readingStatus.textContent = "Correct. The water rises from 40 cm3 to 65 cm3.";
    return;
  }

  readingStatus.className = "calculation-status is-incorrect";
  readingStatus.textContent = "Try again. Read the bottom of each curved meniscus.";
});

densityConceptForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answer = Number(densityConceptAnswer.value);

  if (answer === 4) {
    densityConceptStatus.className = "calculation-status is-correct";
    densityConceptStatus.textContent = "Correct. 80 divided by 20 is 4 g/cm3.";
    return;
  }

  densityConceptStatus.className = "calculation-status is-incorrect";
  densityConceptStatus.textContent = "Try again: density equals mass divided by volume.";
});

function resetDensityLesson() {
  densityConceptAnswer.value = "";
  densityConceptStatus.className = "calculation-status";
  densityConceptStatus.textContent = "Divide mass by volume.";
}

function resetCurrentActivity() {
  if (activeTab === "density") {
    resetDensityLesson();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (activeTab === "meniscus") {
    resetMeniscusExperiment();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (activeTab === "simulator") {
    resetSimulator();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  topicCards.forEach((card) => card.classList.remove("is-selected"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

resetActivity.addEventListener("click", resetCurrentActivity);

applyTheme(getPreferredTheme());
selectMaterial(selectedMaterial);
showTab(getInitialTab());
