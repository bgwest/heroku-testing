#!/bin/bash
# find and shutdown devDb... safely

devDbPid=$(ps -ef | grep testdb | grep -v grep | grep -vE "sh -c mkdir -p ./testdb && mongod --dbpath ./testdb$" | awk '{print $2}')

areYou=""

if [ ! -z $(echo $devDbPid) ]; then
  echo -e "\ndevDbPid targeted..."
  ps -ef | grep $devDbPid | grep -v grep
  echo ""

  while [ "$areYou" != "y" ] && [ "$areYou" != "yes" ] && [ "$areYou" != "n" ] && [ "$areYou" != "no" ]; do
  
    areYou=""
    echo -n "Send control + c to this PID? y/n: "
    read areYou

    if [ "$areYou" == "yes" ] || [ "$areYou" == "y" ]; then
      echo -e "\nDevDB shutdown.\n"
      # sends control + c to safely shutdown the DB
      kill -INT $devDbPid
    elif [ "$areYou" == "no" ] || [ "$areYou" == "n" ]; then
      echo -e "\nKill stopped. Exiting $?.\n"
      exit $?
    fi
done
else
  echo -e "\ndevDbPid found blank. Skipping control+c and exiting.\n"
fi
