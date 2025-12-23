#!/bin/bash

help_message="./sup_run.sh\nThis function must be called with the function name \nExample a delete-user supabase edge function \n./sup_run.sh delete-user\n
The delete user can be replaced with the edge function name to be updated"

if [[ "$1"  ==  "-h" ]] || [[ -z "$1" ]] || [[ "$1" == "--help" ]]; then
	echo -e  "$help_message"

else
	supabase functions deploy ${0} --no-verify-jwt
fi

echo "Deploying the function ${1}"


