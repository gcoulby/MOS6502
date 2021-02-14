@echo off 

set "message=%1"
set test=%2
if /I "%test%" EQU "test" (
    call generate_test_results.bat
)

call git add .

call git commit -m %message%

call git push

@echo on