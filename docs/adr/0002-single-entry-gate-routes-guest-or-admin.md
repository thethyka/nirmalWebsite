# Single entry-gate field routes to guest or admin view

The family wants a barrier that's "not trivial to stumble into" on the whole site, plus a separate, stronger admin capability — without a discoverable `/admin` link a guest could click by accident.

We built one password field at the Entry gate: the guest password unlocks the public site (Home, Gallery, Memories) for a long-lived session; the admin password (a different value) instead unlocks the admin view, in that same session. This is a deliberate deviation from the more obvious "public password wall + separate `/admin` URL" pattern, worth recording so a future maintainer doesn't "fix" it into two separate gates.
