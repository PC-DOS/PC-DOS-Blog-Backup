@echo off
echo 添加中華民國曆(Windows 10 x64)
echo=
echo 將為您的Windows 10添加添加中華民國曆支援。
pause
dism /online /add-package /packagepath:Microsoft-Windows-InternationalFeatures-Taiwan-Package_x64.cab
echo 所要求的作業已完成。
pause