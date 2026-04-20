const Client = require('ssh2-sftp-client');
const path = require('path');

const sftp = new Client();
const localDistPath = path.join(__dirname, '../../dist');
const remotePath = '/var/www/html';

async function deploy() {
    try {
        await sftp.connect({
            host: '31.97.24.35',
            port: 22,
            username: 'root',
            password: 'Imago321123##'
        });
        
        console.log('Uploading dist directory...');
        // fastPut works for single files, uploadDir works for directories
        await sftp.uploadDir(localDistPath, remotePath);
        console.log('Deploy complete!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        sftp.end();
    }
}
deploy();
