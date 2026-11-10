@echo off
chcp 65001 >nul
title FORTE - pregled na telefonu
cd /d "%~dp0"

for /f %%a in ('powershell -NoProfile -Command "(Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null } | Select-Object -First 1).IPv4Address.IPAddress"') do set IP=%%a

echo.
echo  =====================================================
echo    FORTE - pregled sajta na telefonu
echo  =====================================================
echo.
echo    1. Telefon mora biti na ISTOJ Wi-Fi mrezi kao racunar.
echo    2. Na telefonu otvori:
echo.
echo          http://%IP%:8080
echo.
echo    3. Ako Windows pita za dozvolu (zastitni zid),
echo       klikni "Allow / Dozvoli".
echo.
echo    Ostavi ovaj prozor otvoren dok gledas sajt.
echo    Za gasenje: zatvori prozor ili Ctrl+C.
echo  =====================================================
echo.
python -m http.server 8080 --bind 0.0.0.0
pause
