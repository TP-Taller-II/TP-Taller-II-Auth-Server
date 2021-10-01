#!/bin/bash

PROJECT=$1
INTERVAL=${2:-1}
MAX_TRIES=${3:-30}

FORMAT="$(cat << EOF
map(
	select(.Config.Labels["com.docker.compose.project"] == "$PROJECT")
) | map(
	select(if .State.Health.Status == null
		then .State.Status != "running"
		else .State.Health.Status != "healthy"
		end
	)
) | map(.Id) | .[]
EOF
)"

TRIES=0
echo -n "Waiting for healthcheck success"
while [ $TRIES -lt "$MAX_TRIES" ] ; do
	echo -n "."
	ERRORED=$(docker ps -aq \
		| xargs docker inspect -f '{{json .}}' \
		| jq -sr "$FORMAT")

	if [ -z "$ERRORED" ] ; then
		echo " Success"
		exit 0
	else
		TRIES=$((TRIES + 1))
		sleep "$INTERVAL"
	fi
done
echo " Failed"

while read container ; do
	echo "================================================================================"
	echo "$(docker inspect $container -f '{{json .}}' | jq -r .Name[1:])"
	echo "$container"
	docker logs --tail 30 "$container"
done < <(echo "$ERRORED")
exit 1

