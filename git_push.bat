@echo off 

set "message=%1"
set test=%2
if /I "%test%" EQU "test" (
    call yarn test --no-color 2>test_results.txt
)

call git add .

call git commit -m %message%

call git push

@echo on