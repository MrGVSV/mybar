import * as Settings from "./enums";

// === Render Order === //
// This controls which widgets are rendered to the screen.
// The string contains single character commands to display
// widgets from left-to-right. These are the options:
// # Widgets:
//   * 'A': Displays the name of the topmost application
//   * 'B': Displays the battery level
//   * 'S': Displays Spotify information (current song, etc.)
//   * 'T': Displays the date and time
//   * 'W': Displays the current wifi signal strength
// # Spacers:
//   * '-': Flexing empty space
//   * '|': Fixed empty space
// Note: All commands are case-sensitive
export const renderOrder = 'BW-S-T';

// === Widget Config === //
// The following object allows for basic control without
// diving into the code. Change these to your liking.
export const config = {
    // === Root Menu Bar === //
    Root: {
        // Where to position the menubar.
        // 'top' or 'bottom' only.
        position: Settings.Root.Position.TOP,
        // The color of the bar itself
        backgroundColor: '#33364f'
    },
    // === Command: 'A' === //
    Application: {
        // Allows for the text to dynamically change
        // without shifting all the widgets a ton.
        paddedWidth: '100px'
    },
    // === Command: 'B' === //
    Battery: {
        // The tick icon
        tick: '░',
        // Controls how much of a percent each tick in
        // the battery is worth (ex: 0.1 -> 10 ticks)
        tickValue: 0.1,
        // Minimum battery level before displaying the dying alert.
        dyingThreshold: 0.15,
        // The colors to display at any given level.
        // Each step determines a color for all levels below
        // and including the given one. 
        // Values are [<Level>, <Color>]
        colorSteps: Settings.BatteryStyle.Colors.step([
            [0.25, Settings.Colors.RED],
            [0.5, Settings.Colors.YELLOW],
            [1.0, Settings.Colors.GREEN],
        ]),
        // The opacity of the ticks that are empty
        unfilledOpacity: 0.15,
        // Show an alert when the computer is dying
        showDying: true,
        // Show an alert when the computer is charging
        showCharging: true,
        // Set the charging icon. This can be any string or character but
        // it is recommended to use one of the built-in ones because they
        // are cool. May I recommend Settings.BatteryStyle.Icon.Charging.LENNY?
        chargingIcon: Settings.BatteryStyle.Icon.Charging.BOLT,
        // Set the dying icon. Same thing as above pretty much.
        dyingIcon: Settings.BatteryStyle.Icon.Dying.DEATH,
        // Interval to play animation (if any). Recommended setting it
        // to a value divisible by the refreshFrequency.
        animationInterval: 1000,
        // Turn on animations for one, both, or neither of the alerts
        animateAlerts: Settings.BatteryStyle.Animation.ApplyFor.DYING,
        // Set the animation type.
        // Feel free to add your own (see the enums.js for what the format is)
        animationType: Settings.BatteryStyle.Animation.Type.BLINK,
    },
    // === Command: 'S' === //
    Spotify: {
        // This controls the display order for the Spotify widget.
        // The string contains single character commands to display
        // the components from left-to-right. These are the options:
        // # Components:
        //    * 'A': Artist
        //    * 'I': Album Icon
        //    * 'S': Song
        //    * 'T': Time Left
        //    * 's': Is Shuffle On?
        //    * 'r': Is Repeat On?
        //    * any: Any other character can be used as regular text
        // Note: All commands are case-sensitive
        displayOrder: "IS-AT",
        // The color of the Song text
        displaySong: "#fff",
        // Removes all trailing song info after the '('
        shortenSong: true,
        // The color of the Artist text
        displayArtist: "#fff",
        // Determines whether and how to display the Album Artwork
        displayArtwork: Settings.SpotifyStyle.ArtDisplay.SHOW,
        // Determines whether and how to display the Time Left
        displayTime: Settings.SpotifyStyle.TimeDisplay.ICON,
        // Inverts the time display like below:
        //   * TEXT: 1:23/5:00 -> -3:37/5:00
        //   * ICON: Fill Spinner -> Empty Spinner
        invertTime: true,
        // The color of the Time Left icon fill
        timeFill: Settings.Colors.FG,
        // The color of the Time Left text
        timeColor: "#8888",
        // The color of the Shuffle icon
        displayShuffle: "#fff",
        // The color of the Repeat icon
        displayRepeat: "#fff",
        // If true -> displays 'Nothing Playing' if Spotify is closed
        displayDespiteNothing: true,
        // Padding between components
        padding: "3px",
    },
    // === Command: '|' === //
    Spacer: {
        // How much the spacer spaces
        padding: '10px'
    },
    // === Command: 'T' === //
    Time: {
        // This controls the display order for the Time widget.
        // The string contains single character commands to display
        // the components from left-to-right. These are the options:
        // # Components:
        //    * 'W'|'w': Weekday [Default|Abbreviated]
        //    * 'M'|'m': Month   [Default|Abbreviated]
        //    * 'D'|'d': Day     [Default|0-Padded]
        //    * 'Y'|'y': Year    [Default|Abbreviated]
        //    * 'H'|'h': Hours   [Default|24-hour]
        //    * 'P'|'p': Minutes [Default|0-Padded]
        //    * 'S'|'s': Seconds [Default|0-Padded]
        //    * '?': Displays 'AM' or 'PM'
        //    * any: Any other character can be used as regular text
        displayOrder: '[w][m][D] H:p:s ?',
        // Map a color to each command
        colors: {'w': '#f99', 'm': '#b9f', 'D': '#9f7'}
    },
    // === Command: 'W' === //
    Wifi: {
        // The Signal-to-Noise Ratio thresholds to meet.
        // Recommended to not change this. Keep to 5 elements.
        thresholds: [5, 10, 15, 25, 40],
        // Set the colors for each bar of the wifi icon
        // This is simply an array of color values.
        // If there are fewer colors than bars, then the
        // last color in the array is used for the remaining.
        filledColors: Settings.WifiStyle.Color.DEFAULT,
        // Set the color of the empty wifi bars
        emptyBarColor: "#fff5",
        // Determines whether and where to display the SSID
        // of the current network.
        displayName: Settings.WifiStyle.NamePosition.NONE,
    },
};

// This is just a utility function used
// to parse the output of the root command.
export function parseOutput(output, key) {
	try {
		return JSON.parse(output)[key];
	} catch (err) {
		return '';
	}
}
