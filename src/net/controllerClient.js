/** Phone client: connect to host Peer id from ?room= and send INPUT. Wired in Phase 2. */
export function isControllerMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('controller') === '1';
}
