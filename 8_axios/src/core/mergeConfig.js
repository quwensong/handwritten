import { deepMerge, isPlainObject } from "../helpers/util";

const strats = Object.create(null);

function defaultStrat(val1, val2) {
  return typeof val2 !== "undefined" ? val2 : val1;
}

function fromVal2Strat(val1, val2) {
  if (typeof val2 !== "undefined") {
    return val2;
  }
}

function deepMergeStrat(val1, val2) {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2);
  } else if (typeof val2 !== "undefined") {
    return val2;
  } else if (isPlainObject(val1)) {
    return deepMerge(val1);
  } else {
    return val1;
  }
}

const stratKeysFromVal2 = ["url", "params", "data"];

stratKeysFromVal2.forEach((key) => {
  strats[key] = fromVal2Strat;
});

const stratKeysDeepMerge = ["headers", "auth"];

stratKeysDeepMerge.forEach((key) => {
  strats[key] = deepMergeStrat;
});

export default function mergeConfig(config1, config2) {
  if (!config2) {
    config2 = {};
  }

  const config = Object.create(null);

  for (let key in config2) {
    mergeField(key);
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    const strat = strats[key] || defaultStrat;
    config[key] = strat(config1[key], config2[key]);
  }

  return config;
}