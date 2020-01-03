export const Colors = Object.freeze({
    FG: '#fff',

    RED: '#ff8888', 
    YELLOW: '#ffff00',
    GREEN: '#00ff00',
});

export const Root = {
    Position: {
        TOP: 'top',
        BOTTOM: 'bottom'
    }
}

export const BatteryStyle = {
    Colors: {
        DEFAULT: null,
        NONE: 'white',

        step: (steps) => {
            steps.sort((a, b) => a[0] - b[0]);
            return (val) => {            
                for(let step of steps) {                
                    if (val <= (step[0] * 100)) {
                        return step[1]
                    }
                }
                return '#f0f'
            }
        }
    },
    Icon: {
        Charging: {
            NONE: '',
    
            ARROW: '↣',
            BOLT: '⚡',
            CLOVER: '✤',
            EMOTICON: ':⊃',
            HAPPY: '☺',
            HEART: '❤',
            HEART_GREEN: '💚',
            LENNY: '⊚‿⊚',
            PERCENT: '%',
        },
        Dying: {
            NONE: '',
    
            DEATH: '☠',
            EMOTICON: ':⊂',
            ERROR: '∅',
            LENNY: 'ಠ_ಠ',
            SAD: '☹',
            SHOUT: '!!!',
            X: 'X',
        }
    },
    Animation: {
        ApplyFor: {
            NONE: 'none',
    
            DYING: 'dying',
            CHARGING: 'charging',
            BOTH: 'both'
        },
        Type: {
            NONE: '',
    
            BLINK: `
                transform: translate(-50%,-45%);
                @keyframes anim {
                0% { opacity: 1; }
                49% { opacity: 1; }
                50% { opacity: 0; }
                100% { opacity: 0; }
            }`,
            SPIN: `
                @keyframes anim {
                    from {
                        transform: translate(-50%,-45%) rotate(1deg);
                    }
                    to {
                        transform: translate(-50%,-45%) rotate(360deg);
                    }
            }`
        }
    }
}

export const WifiStyle = {
    Color: {
        DEFAULT: [
            '#fff',
        ],
        GREEN: [
            '#8f8',
        ],
        RAINBOW: [
            '#E80000',
            '#E8B500',
            '#26E800',
            '#0083E8',
            '#A600E8',
        ],
        RAINBOW_LIGHT: [
            '#FFBABA',
            '#FFF0BA',
            '#C5FFBA',
            '#BAE2FF',
            '#EBBAFF',
        ]
    },
    NamePosition: {
        NONE: 'none',

        LEFT: 'left',
        RIGHT: 'right'
    },
}

export const SpotifyStyle = {
    ArtDisplay: {
        NONE: 'none',
        SHOW: 'show',
        BORDER: 'border'
    },
    TimeDisplay: {
        NONE: 'none',
        TEXT: 'text',
        ICON: 'icon'
    }
}