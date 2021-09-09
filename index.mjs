import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_PATH = join(__dirname, 'icon-font.scss');
const DIST_PATH = join(__dirname, 'icons.json');
const ICON_NAME_REG_EXP = new RegExp('.icon-[a-z][^:]+', 'ig');

/**
 * Get all classes starts with .icon-* and end with :
 * @returns {stringp[]}
 */
function parse() {
  return readFileSync(SRC_PATH, 'utf8')
    .match(ICON_NAME_REG_EXP)
    .map((className) => className.replace('.icon-', ''));
}

/**
 * Convert snake_case and kebab-case word to camelCase
 * @param {string} value 
 * @returns {string}
 */
function camalCase(value) {
  return value
    .split(/_|-/)
    .map((word, i) => i === 0
      ? word
      : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
};

/**
 * Write JSON file with icons names.
 */
function createClassesCollection() {
  const iconsEnum = parse().reduce((result, icon) => ({
    ...result,
    [camalCase(icon)]: icon,
  }), {});

  writeFileSync(DIST_PATH, JSON.stringify(iconsEnum, null, 2), 'utf-8');

  console.log('Created file', DIST_PATH);
}

createClassesCollection();
