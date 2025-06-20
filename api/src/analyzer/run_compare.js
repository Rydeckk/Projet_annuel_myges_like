import { spawn } from 'child_process';
import fs from 'fs';

const args = [
  'nodejs_bridge.py',
  'compare',
  '--archive1', 'submissions/ex1.zip',
  '--archive2', 'submissions/ex2.zip',
  '--output', 'demo_report.json',
  '--format', 'json',
  '--timeout', '30',
  '--workers', '4',
  '--threshold', '0.8'
];

const process = spawn('python', args);

let output = '';
let error = '';

process.stdout.on('data', (data) => {
  output += data.toString();
});

process.stderr.on('data', (data) => {
  error += data.toString();
});

process.on('close', (code) => {
  if (code !== 0) {
    console.error(`Python script exited with code ${code}`);
    console.error(error);
    return;
  }

  console.log('✅ Analyse terminée');
  try {
    const json = JSON.parse(output);
    console.log('📄 Résultat :', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Échec du parse JSON :', err.message);
    console.log('Sortie brute :\n', output);
  }
});
