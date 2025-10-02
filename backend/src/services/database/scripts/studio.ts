import { exec } from 'child_process';

console.log('Starting Drizzle Studio...');
console.log('Studio will be available at: https://local.drizzle.studio');

exec('npx drizzle-kit studio', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});
