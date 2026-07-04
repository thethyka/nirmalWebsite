# Guest Memories publish instantly; moderation is delete-after-the-fact

Considered a pre-approval queue (nothing public until the admin approves it) against instant publish with admin edit/delete available afterward. Chose instant publish: the family wanted a Memory to feel immediate and warm rather than delayed by a moderation step, and the site is already gated by the guest password (ADR 0002) so submissions come from a known, invited audience rather than the open internet. Admin retains edit/delete as the safety net.

This is a real trade-off — warmth vs. safety — made deliberately because of who has the password, not a default we'd recommend for a public, unauthenticated form.
