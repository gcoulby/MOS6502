echo ==========================================================================>test_results.txt
echo CPU Tests>>test_results.txt
echo ==========================================================================>>test_results.txt
call yarn test cpu --no-color 2>>test_results.txt
echo ==========================================================================>>test_results.txt
echo Assembler Tests>>test_results.txt
echo ==========================================================================>>test_results.txt
call yarn test assembler --no-color 2>>test_results.txt