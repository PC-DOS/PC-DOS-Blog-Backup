@echo off

setlocal EnableExtensions
setlocal EnableDelayedExpansion
set "params=%*"
cd /d "%~dp0" && ( if exist "%temp%\getadmin.vbs" del "%temp%\getadmin.vbs" ) && fsutil dirty query %systemdrive% 1>nul 2>nul || (  echo Set UAC = CreateObject^("Shell.Application"^) : UAC.ShellExecute "cmd.exe", "/k cd ""%~sdp0"" && %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs" && "%temp%\getadmin.vbs" && exit /B )
if ERRORLEVEL 0 (goto IsAdmin) else (goto IsNotAdmin)

:IsAdmin
title Capablity Unlock for Windows Phone
echo This tool applies Capablity Unlock to your Windows Phone device.
echo=
echo DANGER!
echo This hack is only tested on a Lumia 930 running Windows Phone 8.1. It has been confirmed that this hack doesn't support Windows 10 Mobile. Please refer ro Interop Tools, vcREG or Windows Phone Internals.
echo= 
echo Press any key to start...
pause > nul
echo Please specify the drive letter of MainOS. It looks like "E:"
set /p sMainOS=
echo=
echo Importing registry...
reg load HKLM\WP_SYSTEM %sMainOS%\Windows\System32\Config\SYSTEM
reg load HKLM\WP_SOFTWARE %sMainOS%\Windows\System32\Config\SOFTWARE
regedit /s CapabilityUnlock.reg
reg import CapabilityUnlock.reg
reg unload HKLM\WP_SOFTWARE
reg unload HKLM\WP_SYSTEM

echo=
echo Operation finished. Press any key to exit...
pause > nul
exit

:IsNotAdmin
echo ERROR: Please run this program as Administrator. Press any key to exit...
pause > nul
exit