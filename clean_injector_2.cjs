const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src/components/LikeInjector.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Identify the corrupted block
const startIndex = content.indexOf('</div>\n          </div> চেষ্টা করুন।');
if (startIndex !== -1) {
  const endIndex = content.indexOf('</div>\n          </div>\n', startIndex + 30); // Find next closing
  if (endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex + 22);
    const replacement = '</div>\n        </motion.div>\n      )}\n';
    fs.writeFileSync(filePath, before + replacement + after, 'utf8');
    console.log('SUCCESSFULLY REPLACED CORRUPTED REGION!');
  } else {
    console.error('Could not find end of corrupted block');
  }
} else {
  console.error('Could not find start of corrupted block');
}
