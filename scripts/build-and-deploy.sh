#!/usr/bin/env bash


cd ~/proj/codecommit/notion-chronometer
function fail(){
        osascript -e 'tell app "System Events" to display dialog "Fail ❌❌❌  "'
}
function completed(){
        osascript -e 'tell app "System Events" to display dialog "'$1' 🟢🟢🟢  "'
}


version=$(cat ./manifest.json | grep '"version"' | sed -r 's/"version": "(.*)",$/\1/' |  sed -r "s/ //g" )
# remove all runDev command
devPs=$(ps -ef | awk '/[r]unDev/{print $2}')
echo "REMOVING ACTIVE RUN DEV" $devPs
kill $devPs
yarn build && yarn build:firefox
retVal=$?
echo $retVal

if [ $retVal -ne 0 ]
then
    fail
    exit 1
fi

rm -rf /tmp/extension
mkdir /tmp/extension
cp -r ./web-ext-artifacts/notion_time_tracker-$version.zip /tmp/extension/.
open /tmp/extension/.
sleep 1

osascript <<'END'
tell application "Finder"
	set screenResolution to bounds of window of desktop
end tell

set screenWidth to item 3 of screenResolution
set screenHeight to item 4 of screenResolution
tell application "System Events" to tell process "Finder"
    set position of window 1 to {screenWidth-500, 0}
    set size of window 1 to {400, 500}
end tell
END


# open Chrome Store page
open -na 'Google Chrome' --args --new-window 'https://chrome.google.com/webstore/devconsole/cb5d2131-45b8-4cfb-84a8-90a38bfb4682/ihjgjhbdigphchkplmlkpmhncnmjhanp/edit/package?hl=fr'
sleep 1
osascript <<'END'
tell application "Finder"
	set screenResolution to bounds of window of desktop
end tell

set screenWidth to item 3 of screenResolution
set screenHeight to item 4 of screenResolution
tell application "Google Chrome"
    set bounds of front window to {0, 0, screenWidth-500, screenHeight}
end tell
END

completed "you can now upload it to the chrome store"