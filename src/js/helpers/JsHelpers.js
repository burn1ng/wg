
export function get_int_from_str(string) {
    return parseInt(string.replace(/^\D+/g, '')) || null;
}