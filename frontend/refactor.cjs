const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  { path: 'src/components/ChatBox.jsx', depth: 2 },
  { path: 'src/components/UploadForm.jsx', depth: 2 },
  { path: 'src/pages/AdminDashboard.jsx', depth: 2 },
  { path: 'src/pages/Login.jsx', depth: 2 },
  { path: 'src/pages/SignUp.jsx', depth: 2 },
  { path: 'src/pages/admin/Candidates.jsx', depth: 3 },
  { path: 'src/pages/admin/Jobs.jsx', depth: 3 },
  { path: 'src/pages/admin/Settings.jsx', depth: 3 },
  { path: 'src/pages/candidate/CandidateDashboard.jsx', depth: 3 },
  { path: 'src/pages/candidate/Profile.jsx', depth: 3 },
  { path: 'src/pages/candidate/ResumeBuilder.jsx', depth: 3 }
];

filesToUpdate.forEach(fileObj => {
  const filePath = path.join(__dirname, fileObj.path);
  if (!fs.existsSync(filePath)) {
    console.log(`Not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Calculate relative path to lib/api.js
  const apiImportPath = fileObj.depth === 3 ? '../../lib/api' : '../lib/api';
  
  // Add import if not present
  if (!content.includes('fetchApi')) {
    // find the last import
    const lastImportIndex = content.lastIndexOf('import ');
    const newlineAfterImport = content.indexOf('\n', lastImportIndex);
    const importStatement = `\nimport { fetchApi } from '${apiImportPath}';\n`;
    
    if (newlineAfterImport !== -1) {
      content = content.slice(0, newlineAfterImport) + importStatement + content.slice(newlineAfterImport);
    } else {
      content = importStatement + content;
    }
  }

  // Replace fetch('http://localhost:3000... with fetchApi('...
  content = content.replace(/fetch\('http:\/\/localhost:3000/g, "fetchApi('");
  content = content.replace(/fetch\(`http:\/\/localhost:3000/g, "fetchApi(`");

  // Fix header token duplicates manually
  // Actually fetchApi automatically adds Bearer token, so we don't strictly need to remove it from components,
  // but it's cleaner to remove it. Let's just leave it for now, fetchApi merges/overrides headers.
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated: ${fileObj.path}`);
});
