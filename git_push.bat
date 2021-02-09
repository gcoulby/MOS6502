@echo off 

set "message=%1"

call yarn test --no-color 2>test_results.txt

call git add .

call git commit -m %message%

call git push

@echo on