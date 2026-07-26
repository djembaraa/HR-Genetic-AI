const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/UploadForm.jsx',
  'src/pages/SignUp.jsx',
  'src/pages/admin/Candidates.jsx',
  'src/pages/candidate/CandidateDashboard.jsx',
  'src/pages/candidate/ResumeBuilder.jsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add import if not present
  if (!content.includes('react-hot-toast')) {
    const lastImportIndex = content.lastIndexOf('import ');
    const newlineAfterImport = content.indexOf('\n', lastImportIndex);
    const importStatement = `\nimport toast from 'react-hot-toast';\n`;
    
    if (newlineAfterImport !== -1) {
      content = content.slice(0, newlineAfterImport) + importStatement + content.slice(newlineAfterImport);
    } else {
      content = importStatement + content;
    }
  }

  // Replace alert( with toast(
  // I will just use toast() as generic or map them manually. Let's do simple regex.
  // Success alerts usually have words like 'Success', 'created', 'queued'
  content = content.replace(/alert\((.*?(Success|created|queued).*?)\)/gi, 'toast.success($1)');
  
  // Other alerts replace with toast.error
  content = content.replace(/alert\(/g, 'toast.error(');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated toast in: ${file}`);
});
