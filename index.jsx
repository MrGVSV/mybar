// *************************************************************************
// NOTE: For adjusting settings, it is recommended to do so in ./src/config.js
// *************************************************************************

import { css, styled  } from "uebersicht"
import { renderOrder, config } from './src/config'
import {
	Application,
	Battery,
	Spotify,
	Time,
	Wifi
} from './src/components/Components'
export const refreshFrequency = 1000


// === Root Element Style === //
export const className = `
	${config.Root.position}: 0px;
	left: 0;
	width: 100%;
	height: 26px;
	padding-top: 1px;
	background-color: ${config.Root.backgroundColor};
	@import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap');
	font-family: 'Source Code Pro', monospace;
	color: white;
	whitespace: nowrap;
`

const Padding = styled('div')`
	width: ${config.Spacer.padding};
`

const Space = styled('div')`
	flex: 1;
`

export const render = ({ output, error }) => {

	// === Log Any Errors === //
	if(error !== undefined) {
		console.error('Error in MyBar Widget:\n', error);
	}
	
	// === Add Components Based on Render Order === //
	let components = [];
	let index = 0;
	for(let item of renderOrder) {
		
		switch (item) {
			case 'A':
				components.push(<Application key={index} output={output} />);
				break;
			case 'B':
				components.push(<Battery key={index} output={output} />);
				break;
			case 'T':
			components.push(<Time key={index} />)
				break;
			case 'W':
				components.push(<Wifi key={index} output={output} />);
				break;
			case 'S':
				components.push(<Spotify key={index} output={output} />);
				break;
			case '|':
				components.push(<Padding key={index} />)
				break;
			case '-':
				components.push(<Space key={index} />)
				break;
			default:
				break;
		}

		index++;

	}

	return (
		<div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'space-evenly', whiteSpace: 'nowrap'}}>
			{components}
		</div>
	)
}

// === Command === //
// This is the command that Ubersicht passes to the system.
// It's output is then passed into the render function as (output, error).
// The output of this command is echoed as a JSON string which can then be parsed.
export const command = `
# === BATTERY ===#
# Get percent charged
CHARGE=$(pmset -g batt | egrep '(\\d+)\%' -o | cut -f1 -d%)
# Get if plugged in
PLUGGED=$(if [[ $(pmset -g ps | head -1) =~ "AC" ]]; then echo "true"; else echo "false"; fi)

# === WIFI === #
# Get RSSI (signal strength)
WIFI_RSSI=$(/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | grep agrCtlRSSI | cut -d ':' -f 2)
# Get signal noise
WIFI_NOISE=$(/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | grep agrCtlNoise | cut -d ':' -f 2)
# Function to check if RSSI and Noise are numbers
function isNumber() {
  re='^[+-]?[0-9]+([.][0-9]+)?$'
  if [[ $1 =~ $re ]]; then echo $1 ; else echo '0' ; fi
}
# Calculate the Signal-to-Noise Ratio
WIFI_SNR=$(($(isNumber $WIFI_RSSI)-$(isNumber $WIFI_NOISE)))
# Get Wifi SSID
WIFI_NAME=$(/System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport -I | grep SSID | tail -n1 | cut -d ':' -f2)
# Get Wifi on/off
WIFI_STATUS=$(if [ -n "$(/System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport -I | grep AirPort | cut -d ':' -f2)" ]; then echo "false"; else echo "true"; fi)

# === SPOTIFY === #
# Uses <JSONQuote> to get around weird quote escape error
SPOTIFY=$(
	osascript <<EOD | sed -e 's/<JSONQuote>/\"/g'
	if application "Spotify" is running then	
		tell application "Spotify"
			set mSong to the name of the current track
			set mArtist to the artist of the current track
			set mArtwork to the artwork url of the current track
			set mDuration to the duration of the current track
			set mPosition to the player position
			set mState to the player state
			set mRepeat to the repeating
			set mShuffle to the shuffling
		end tell
		return "{<JSONQuote>song<JSONQuote>: <JSONQuote>" & mSong & "<JSONQuote>, <JSONQuote>artist<JSONQuote>: <JSONQuote>" & mArtist & "<JSONQuote>, <JSONQuote>artwork<JSONQuote>: <JSONQuote>" & mArtwork & "<JSONQuote>, <JSONQuote>duration<JSONQuote>: <JSONQuote>" & mDuration & "<JSONQuote>, <JSONQuote>position<JSONQuote>: <JSONQuote>" & mPosition & "<JSONQuote>, <JSONQuote>state<JSONQuote>: <JSONQuote>" & mState & "<JSONQuote>, <JSONQuote>repeat<JSONQuote>: <JSONQuote>" & mRepeat & "<JSONQuote>, <JSONQuote>shuffle<JSONQuote>: <JSONQuote>" & mShuffle & "<JSONQuote>}"
	else
		return "{}"
	end if
EOD
)

# === Application === #
# Get frontmost application
APP=$(
	osascript <<EOD
	tell application "System Events"
		get short name of application processes whose frontmost is true and visible is true
	end tell
EOD
)

# === Output JSON === #
# Note: Spotify is purposely missing quotes
echo $(cat <<-EOF
{
	"app": "$APP",
	"spotify": $SPOTIFY,
	"charge": "$CHARGE",
	"plugged": "$PLUGGED",
	"snr": "$WIFI_SNR",
	"wifi": "$WIFI_NAME",
	"rssi": "$WIFI_RSSI",
	"noise": "$WIFI_NOISE",
	"status": "$WIFI_STATUS"
}
EOF
);
`