@echo off
echo ============================================
echo Checking robots.txt
echo ============================================
curl -s https://www.inhbiomat.com/robots.txt | findstr "inhbiomat.com"
echo.
echo.
echo ============================================
echo Checking sitemap.xml
echo ============================================
curl -s https://www.inhbiomat.com/sitemap.xml | findstr "inhbiomat.com"
echo.
echo.
echo ============================================
echo If you see "inhbiomat.com" above, SUCCESS!
echo If you see "inbiomat.co.kr", cache not cleared yet.
echo ============================================
pause
