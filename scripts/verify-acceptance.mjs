// scripts/verify-acceptance.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

let failures = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failures++;
  } else {
    console.log(`PASS: ${message}`);
  }
}

console.log('\n--- RUNNING CODEGUIDE ACCEPTANCE TESTS ---\n');

// 1. Verify Core File Structure
const requiredFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'app/(auth)/login/page.tsx',
  'app/(auth)/signup/page.tsx',
  'app/solve/[id]/page.tsx',
  'app/summary/[id]/page.tsx',
  'components/Navbar.tsx',
  'components/Footer.tsx',
  'components/HeroMiniDemo.tsx',
  'components/ProblemCard.tsx',
  'components/PaperCard.tsx',
  'components/Stepper.tsx',
  'components/HintLadder.tsx',
  'components/ApproachCard.tsx',
  'components/CodeBlock.tsx',
  'components/ComplexityBadges.tsx',
  'components/TradeoffTable.tsx',
  'components/TutorChat.tsx',
  'lib/problems.ts',
  'lib/mockSolutions.ts',
  'lib/storage.ts',
  'lib/supabase.ts',
  'types/index.ts',
  'rag.json',
  'tailwind.config.js'
];

for (const f of requiredFiles) {
  assert(fs.existsSync(path.join(root, f)), `File exists: ${f}`);
}

// 2. Anti-AI-Slop Code Scanner
const uiDirs = ['components', 'app'];
let foundSlop = false;
for (const dir of uiDirs) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) continue;

  function scanDir(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        scanDir(p);
      } else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts') || e.name.endsWith('.css')) {
        const content = fs.readFileSync(p, 'utf8');
        // Check for banned glassmorphism
        if (/backdrop-blur/i.test(content)) {
          assert(false, `Anti-slop violation: 'backdrop-blur' found in ${path.relative(root, p)}`);
          foundSlop = true;
        }
        // Check for banned rounded-full pills on badges/tags
        if (/rounded-full/i.test(content)) {
          assert(false, `Anti-slop violation: 'rounded-full' found in ${path.relative(root, p)}. Use rounded-none or rounded-sm.`);
          foundSlop = true;
        }
        // Check for banned magic sparkles emoji
        if (/✨/i.test(content)) {
          assert(false, `Anti-slop violation: 'sparkles emoji' found in ${path.relative(root, p)}`);
          foundSlop = true;
        }
      }
    }
  }
  scanDir(fullDir);
}
if (!foundSlop) {
  assert(true, 'Zero glassmorphism, zero rounded pills, zero sparkle emojis across all components');
}

// 3. Knowledge Base Verification
const ragContent = JSON.parse(fs.readFileSync(path.join(root, 'rag.json'), 'utf8'));
assert(Array.isArray(ragContent) && ragContent.length >= 25, `rag.json contains ${ragContent.length} curated problems (expected >= 25)`);
const twoSum = ragContent.find(p => p.id === 'two_sum');
assert(twoSum && twoSum.difficulty === 'Easy' && twoSum.pattern === 'Hash Map', 'two_sum problem schema verified');

// 3b. Verify Track Coverage
const problemsTs = fs.readFileSync(path.join(root, 'lib/problems.ts'), 'utf8');
assert(problemsTs.includes('TRACKS'), 'Pattern tracks configured in lib/problems.ts');
for (const p of ragContent) {
  assert(problemsTs.includes(`'${p.id}'`) || problemsTs.includes(`"${p.id}"`), `Problem '${p.id}' mapped to a Pattern Track`);
}

// 4. Color Token Verification in tailwind.config.js
const tailwindConfig = fs.readFileSync(path.join(root, 'tailwind.config.js'), 'utf8');
assert(tailwindConfig.includes('#12151c'), 'Canvas color (#12151c) configured');
assert(tailwindConfig.includes('#191e28'), 'Panel color (#191e28) configured');
assert(tailwindConfig.includes('#f6f3ec'), 'Paper color (#f6f3ec) configured');
assert(tailwindConfig.includes('#e3a448'), 'Amber brand color (#e3a448) configured');

console.log(`\nTests completed with ${failures} failure(s).\n`);
process.exit(failures > 0 ? 1 : 0);
