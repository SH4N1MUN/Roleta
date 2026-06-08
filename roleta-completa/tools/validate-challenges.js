"use strict";
const fs = require("fs");
const vm = require("vm");

// Carrega arquivo com tratamento de erro
let source;
try {
  source = fs.readFileSync("data/challenges.js", "utf8");
} catch (err) {
  console.error("❌ Arquivo não encontrado:", err.message);
  process.exit(1);
}

// Executa com tratamento de erro
const context = { window: {}, console };
vm.createContext(context);
try {
  vm.runInContext(source, context, { filename: "data/challenges.js" });
} catch (err) {
  console.error("❌ Erro ao carregar challenges.js:", err.message);
  process.exit(1);
}

const bank = context.window.ROULETTE_CHALLENGE_BANK;
if (!bank) {
  console.error("❌ ROULETTE_CHALLENGE_BANK não encontrado");
  process.exit(1);
}

const challenges = [
  ...(bank?.baseChallenges || []),
  ...(bank?.adaptiveChallenges || [])
];

const VALID_MODES = new Set(["couple", "solo", "both", undefined]);
const VALID_PRESETS = new Set(["feminine", "masculine", undefined]);
const VALID_ROLE_TARGETS = new Set(["current", "other", "female", "male", undefined]);
const VALID_PHASE_VARIANTS = new Set(["sensory", "guided", "direct", "edge", "retreat", "mutual", "display", undefined]);
const VALID_INSIGHT_TARGETS = new Set(["actor", "receiver", "female", "couple", undefined]);
const VALID_REQUIRED_ITEMS = new Set(["lubricant", "massageOil", "vibrator", "analToy", "camera"]);
const VALID_CONSENT_LIMITS = new Set(["anal", "throat", "impact", "recording"]);
const VALID_TOKENS = new Set([
  "{actor}", "{receiver}", "{partner_one}", "{partner_two}",
  "{female_partner}", "{other_partner}", "{art_actor}", "{subj_actor}",
  "{pron_actor}", "{dir_actor}", "{art_rec}", "{subj_rec}",
  "{pron_rec}", "{dir_rec}", "{subj_female}", "{pron_female}",
  "{dir_female}", "{subj_other}", "{pron_other}", "{dir_other}",
  "{arousal_rec}", "{arousal_actor}", "{actor_attentive}",
  "{receiver_attentive}", "{actor_devoured}", "{receiver_devoured}",
  "{actor_dirty}", "{receiver_dirty}", "{actor_naked}", "{receiver_naked}",
  "{actor_touched}", "{receiver_touched}", "{rec_intimacy}",
  "{rec_intimacy_article}", "{rec_intimacy_locative}", "{own_intimacy}",
  "{actor_intimacy}", "{underwear_outer}", "{underwear_inside}",
  "{chest_underwear}", "{bottom_underwear}"
]);

const errors = [];
const ids = new Set();

challenges.forEach((challenge, index) => {
  const label = challenge.id || `#${index}`;

  if (!challenge.id) errors.push(`${label}: id ausente`);
  if (ids.has(challenge.id)) errors.push(`${label}: id duplicado`);
  ids.add(challenge.id);

  if (!Number.isInteger(challenge.rank) || challenge.rank < 1 || challenge.rank > 7) {
    errors.push(`${label}: rank deve ser 1-7`);
  }

  if (!VALID_MODES.has(challenge.mode)) 
    errors.push(`${label}: mode inválido`);
  if (!VALID_PRESETS.has(challenge.actorPreset)) 
    errors.push(`${label}: actorPreset inválido`);
  if (!VALID_PRESETS.has(challenge.receiverPreset)) 
    errors.push(`${label}: receiverPreset inválido`);
  if (!VALID_ROLE_TARGETS.has(challenge.actorTarget)) 
    errors.push(`${label}: actorTarget invalido`);
  if (!VALID_ROLE_TARGETS.has(challenge.receiverTarget)) 
    errors.push(`${label}: receiverTarget invalido`);
  if (!VALID_PHASE_VARIANTS.has(challenge.phaseVariant)) 
    errors.push(`${label}: phaseVariant invalido`);
  if (!VALID_INSIGHT_TARGETS.has(challenge.insightTarget)) 
    errors.push(`${label}: insightTarget inválido`);

  validateListField(challenge, "requiredItems", VALID_REQUIRED_ITEMS, label, errors);
  validateListField(challenge, "actorLimits", VALID_CONSENT_LIMITS, label, errors);
  validateListField(challenge, "receiverLimits", VALID_CONSENT_LIMITS, label, errors);
  validateListField(challenge, "blockedByLimits", VALID_CONSENT_LIMITS, label, errors);

  if (!challenge.title || typeof challenge.title !== "string") 
    errors.push(`${label}: title inválido`);
  if (!challenge.text || typeof challenge.text !== "string") 
    errors.push(`${label}: text inválido`);

  if (!Number.isInteger(challenge.seconds) || (challenge.seconds !== 0 && (challenge.seconds < 5 || challenge.seconds > 300))) 
    errors.push(`${label}: seconds deve ser 0 ou estar entre 5 e 300 segundos`);

  ["requiresFemale", "requiresMale", "requiresMixedPair"].forEach(field => {
    if (challenge[field] !== undefined && typeof challenge[field] !== "boolean") 
      errors.push(`${label}: ${field} deve ser boolean`);
  });

  // Valida tokens em title e text
  const allText = (challenge.title || "") + " " + (challenge.text || "");
  const tokens = allText.match(/\{[a-z_]+\}/g) || [];
  const tokenSet = new Set(tokens);
  tokens.forEach((token) => {
    if (!VALID_TOKENS.has(token)) 
      errors.push(`${label}: token desconhecido ${token}`);
  });

  const declaresRoleBinding = Boolean(challenge.actorPreset || challenge.receiverPreset || challenge.actorTarget || challenge.receiverTarget);
  const requiresFemaleRole = challenge.requiresFemale || challenge.actorPreset === "feminine" || challenge.receiverPreset === "feminine" || challenge.actorTarget === "female" || challenge.receiverTarget === "female";

  if (tokenSet.has("{female_partner}") && !requiresFemaleRole) {
    errors.push(`${label}: usa {female_partner} sem declarar requiresFemale/preset/target feminine`);
  }
  if (tokenSet.has("{other_partner}") && !challenge.requiresFemale) {
    errors.push(`${label}: usa {other_partner} sem requiresFemale`);
  }
  if (challenge.turnMode !== "mutual" && tokenSet.has("{actor}") && tokenSet.has("{female_partner}") && !declaresRoleBinding) {
    errors.push(`${label}: mistura {actor} com {female_partner} sem preset/target`);
  }
  if (challenge.turnMode !== "mutual" && tokenSet.has("{receiver}") && tokenSet.has("{other_partner}") && !declaresRoleBinding) {
    errors.push(`${label}: mistura {receiver} com {other_partner} sem preset/target`);
  }
});

// Saída
function validateListField(challenge, field, validValues, label, errors) {
  if (challenge[field] === undefined) return;
  if (!Array.isArray(challenge[field])) {
    errors.push(`${label}: ${field} deve ser uma lista`);
    return;
  }

  challenge[field].forEach((value) => {
    if (!validValues.has(value)) errors.push(`${label}: ${field} invalido ${value}`);
  });
}

if (errors.length) {
  console.error(`\n❌ Banco inválido: ${errors.length} erro(s)\n`);
  errors.forEach((error) => console.error(`   - ${error}`));
  process.exit(1);
} else {
  console.log(`\n✅ Banco válido: ${challenges.length} desafios, ${ids.size} IDs únicos.\n`);
}
