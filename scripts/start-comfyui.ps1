[CmdletBinding()]
param(
  [ValidateRange(1, 65535)]
  [int]$Port = 8188,

  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$listenAddress = '127.0.0.1'
$baseUrl = "http://${listenAddress}:$Port"
$healthUrl = "$baseUrl/system_stats"

function Test-ComfyUi {
  try {
    $response = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 3
    return $null -ne $response.system
  } catch {
    return $false
  }
}

function Open-ComfyUi {
  if (-not $NoBrowser) {
    Start-Process $baseUrl
  }
}

if (Test-ComfyUi) {
  Write-Host "ComfyUI is already running at $baseUrl"
  Open-ComfyUi
  exit 0
}

$candidateRoots = @(
  $env:COMFYUI_HOME
  (Join-Path $env:LOCALAPPDATA 'ComfyUI')
  (Join-Path $env:USERPROFILE 'ComfyUI')
  (Join-Path $env:USERPROFILE 'ComfyUI_windows_portable')
  (Join-Path $env:USERPROFILE 'Downloads\ComfyUI_windows_portable')
) | Where-Object { $_ } | Select-Object -Unique

$launch = $null

foreach ($root in $candidateRoots) {
  $resolvedRoot = [Environment]::ExpandEnvironmentVariables($root)
  $manualMain = Join-Path $resolvedRoot 'main.py'
  $manualPython = Join-Path $resolvedRoot '.venv\Scripts\python.exe'
  $portableMain = Join-Path $resolvedRoot 'ComfyUI\main.py'
  $portablePython = Join-Path $resolvedRoot 'python_embeded\python.exe'

  if ((Test-Path -LiteralPath $manualMain) -and (Test-Path -LiteralPath $manualPython)) {
    $launch = @{
      Root = $resolvedRoot
      Python = $manualPython
      Arguments = @(
        'main.py'
        '--cpu'
        '--listen'
        $listenAddress
        '--port'
        $Port
      )
    }
    break
  }

  if ((Test-Path -LiteralPath $portableMain) -and (Test-Path -LiteralPath $portablePython)) {
    $launch = @{
      Root = Join-Path $resolvedRoot 'ComfyUI'
      Python = $portablePython
      Arguments = @(
        '-s'
        $portableMain
        '--cpu'
        '--windows-standalone-build'
        '--listen'
        $listenAddress
        '--port'
        $Port
      )
    }
    break
  }
}

if (-not $launch) {
  throw @"
ComfyUI was not found.
Set COMFYUI_HOME to the ComfyUI or ComfyUI_windows_portable directory, then run this command again.
"@
}

$logDirectory = Join-Path $launch.Root 'user\logs'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
$stdoutLog = Join-Path $logDirectory 'codex-launch.stdout.log'
$stderrLog = Join-Path $logDirectory 'codex-launch.stderr.log'

$existingListener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($existingListener) {
  throw "Port $Port is already in use, but the service is not a healthy ComfyUI instance."
}

Write-Host "Starting ComfyUI from $($launch.Root)"
Start-Process `
  -FilePath $launch.Python `
  -ArgumentList $launch.Arguments `
  -WorkingDirectory $launch.Root `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog `
  -WindowStyle Hidden | Out-Null

$deadline = (Get-Date).AddSeconds(120)
do {
  Start-Sleep -Seconds 2
  if (Test-ComfyUi) {
    Write-Host "ComfyUI is ready at $baseUrl"
    Write-Host "Logs: $stderrLog"
    Open-ComfyUi
    exit 0
  }
} while ((Get-Date) -lt $deadline)

throw "ComfyUI did not become ready within 120 seconds. Check $stderrLog"
