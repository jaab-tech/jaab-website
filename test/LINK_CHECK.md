Link checker: behavior and ignored hosts
=====================================

Purpose
-------
This repository includes a small link-check utility at `test/link_check.py` that
scans generated HTML under `_site` and validates external http(s) links. It is
intended to be a quick, local smoke-test to catch obvious broken links before
publishing.

Ignored / noisy hosts
---------------------
During local development some hosts or URLs are noisy for automated checks:

- Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) — these sometimes
  return non-200 responses for programmatic HEAD requests or vary by UA.
- Translation proxies (`translate.google.com` pointing at `0.0.0.0` or
  `127.0.0.1`) — these are artifacts of running a local server and do not
  represent real production errors.
- LinkedIn, BusinessWire and some newswire or enterprise sites — these may
  block automated clients or return nonstandard codes (e.g., `999`).
- Claude / other AI sites — some block programmatic access.

To reduce false positives the link checker skips a small list of known noisy
host suffixes and simple substrings (see the `IGNORE_HOST_SUFFIXES` and
`IGNORE_SUBSTRINGS` constants inside `test/link_check.py`). If you want a link
to be validated even though it matches one of the ignored patterns, open the
HTML page in a browser and test the link manually.

How to run
----------
From the repository root:

```bash
python3 test/link_check.py
```

The script prints skipped links, BAD entries and a short summary. It exits with
code `2` when failures are present (so you can use it in CI or scripts).

If you want to tune the ignored hosts, edit `test/link_check.py` and add or
remove suffixes from `IGNORE_HOST_SUFFIXES` or substrings from
`IGNORE_SUBSTRINGS`.

Notes
-----
- This checker is intentionally conservative and tuned for local dev. For CI
  or a production preflight you may want a stricter checker or a remote
  environment that can access the same network as production.
