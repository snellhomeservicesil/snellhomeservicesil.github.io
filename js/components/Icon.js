// Icon Component - Simple SVG icon wrapper
function Icon({ d, size = 24 }) {
    const e = React.createElement;
    return e('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2"
    }, e('path', { d }));
}
