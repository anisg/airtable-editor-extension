#!/usr/bin/env bash
cd ~/proj/codecommit/notion-chronometer
open -na 'Google Chrome' --args --new-window 'chrome://extensions'
sleep 1
echo "ADDING RESIZE + POSITION"
osascript <<'END'
tell application "Finder"
	set screenResolution to bounds of window of desktop
end tell

set screenWidth to item 3 of screenResolution
set screenHeight to item 4 of screenResolution
tell application "System Events" to tell process "Google Chrome"
    set position of window 1 to {screenWidth-500, 0}
    set size of window 1 to {400, 500}
end tell
END
osascript <<'END'
tell application "System Events"
	set targetProcess to (name of first process where it is frontmost)
    keystroke "chrome://extensions"
	key code 36
end tell
END
sleep 1
# open TESTING PAGE
open -na 'Google Chrome' --args --new-window 'https://www.notion.so/1a76c9fc6c8d40bd9757ff99d504c0df?v=9c54fc15e70a4c93a2a9b0d9d1969308'
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
sleep 1
# # open PRODUCT Page
open ~/Applications/Chrome\ Apps.localized/Notion\ Chronometer.app
sleep 1
osascript <<'END'
tell application "Finder"
	set screenResolution to bounds of window of desktop
end tell

set screenWidth to item 3 of screenResolution
set screenHeight to item 4 of screenResolution
tell application (path to frontmost application as text)
    set bounds of front window to {300, 0, screenWidth-300, screenHeight}
end tell
END
# open DEV PAGE
code .
sleep 2
osascript <<'END'
tell application "System Events"
        keystroke "f" using {command down, control down}
end tell
END
sleep 2
osascript <<'END'
tell application "System Events"
        key code 123 using {command down, option down}
end tell
END
