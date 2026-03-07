# Libera a porta 5000 no Firewall do Windows para o backend ser acessível pelo celular (Expo Go).
# Execute como Administrador: clique direito no script -> "Executar com PowerShell" (como admin)
# ou no PowerShell: Start-Process powershell -Verb RunAs -ArgumentList '-File', '.\scripts\allow-port-5000-firewall.ps1'

$ruleName = "Eu Me Cuido - Backend porta 5000"
$port = 5000

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  Write-Host "Execute este script como Administrador (clique direito -> Executar como administrador)." -ForegroundColor Yellow
  exit 1
}

$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Regra já existe. Removendo para recriar..." -ForegroundColor Gray
  Remove-NetFirewallRule -DisplayName $ruleName
}

New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -LocalPort $port -Protocol TCP -Action Allow -Profile Private
Write-Host "Porta $port liberada no Firewall (rede privada). O celular na mesma Wi-Fi pode acessar o backend." -ForegroundColor Green
