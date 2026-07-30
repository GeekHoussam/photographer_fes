const lintStagedConfig = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md,yml,yaml}": "prettier --write",
};

export default lintStagedConfig;
