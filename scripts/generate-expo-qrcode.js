/**
 * Gera QR code da URL do Expo Go para o celular escanear.
 * Prioriza o IP da rede Wi-Fi (192.168.x.x) para o celular conseguir conectar.
 *
 * Uso: node scripts/generate-expo-qrcode.js [IP]
 * Sem argumento: tenta detectar o IP da rede local (Wi-Fi).
 */

const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const os = require('os');

const port = 8081;

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const families = ['IPv4'];
  // Preferir 192.168.x.x (Wi-Fi típico) para celular na mesma rede
  const preferred = ['192.168.', '10.0.'];
  const fallback = ['172.16.', '172.17.', '172.18.', '172.19.', '172.2', '172.30.', '172.31.'];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.internal || !families.includes(iface.family)) continue;
      const addr = iface.address;
      if (preferred.some((p) => addr.startsWith(p))) return addr;
    }
  }
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.internal || !families.includes(iface.family)) continue;
      const addr = iface.address;
      if (fallback.some((p) => addr.startsWith(p))) return addr;
    }
  }
  return '192.168.1.1';
}

const ip = process.argv[2] || getLocalIP();
const expoUrl = `exp://${ip}:${port}`;

const outDir = path.join(__dirname, '..', 'mobile');
const outFile = path.join(outDir, 'expo-go-qrcode.png');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

QRCode.toFile(outFile, expoUrl, { width: 400, margin: 2 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('QR code salvo em:', outFile);
  console.log('URL do Expo Go:', expoUrl);
  console.log('');
  console.log('Para usar no CELULAR (evitar tela azul):');
  console.log('1. Celular e PC no MESMO Wi-Fi');
  console.log('2. No PC, inicie o Expo: cd mobile && npm start');
  console.log('3. Escaneie este QR code com o app Expo Go');
  console.log('4. Se der tela azul, o IP pode estar errado. Veja o IP no terminal do Expo');
  console.log('   e gere de novo: node scripts/generate-expo-qrcode.js SEU_IP');
  console.log('');
  console.log('Alternativa: use o QR code que aparece no terminal ao rodar "npm start" no mobile.');
});
