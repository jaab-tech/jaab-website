#!/usr/bin/env python3
"""
Link checker for generated _site with configurable ignore list for known noisy targets.

This script scans HTML files under `_site`, extracts http(s) links and checks them
with HEAD (then GET fallback). Some public sites block or throttle automated
clients (LinkedIn, BusinessWire, Google Translate proxies, etc.) which produce
noise during local development. To make the checker practical for local use we
maintain a short ignore list below. The ignore list and rationale are documented
in `test/LINK_CHECK.md`.

Output:
 - prints skipped (ignored) links summary
 - prints BAD entries for links that returned non-2xx responses (after retries)
 - exits with code 2 when there are failures, 0 otherwise
"""
import sys
import os
import re
import concurrent.futures
from urllib.parse import urlparse

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


ROOT = os.path.join(os.path.dirname(__file__), '..', '_site')

link_re = re.compile(r'href=["\'](http[s]?://[^"\']+)["\']', re.I)

# Known noisy hosts (domains or suffixes). If a link's netloc endswith any of
# these values, the link is skipped in the main check. Add more as needed.
IGNORE_HOST_SUFFIXES = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'claude.ai',
    'linkedin.com',
    'businesswire.com',
    'translate.google.com',
]

# Known substrings that indicate local-dev translate proxies or 0.0.0.0 references
# we don't want to test from a dev machine.
IGNORE_SUBSTRINGS = [
    '0.0.0.0',
    '127.0.0.1',
]


def find_links():
    links = set()
    for dirpath, _, filenames in os.walk(ROOT):
        for fn in filenames:
            if fn.lower().endswith('.html'):
                path = os.path.join(dirpath, fn)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        text = f.read()
                        for m in link_re.finditer(text):
                            links.add(m.group(1))
                except Exception as e:
                    print('Error reading', path, e, file=sys.stderr)
    return sorted(links)


def is_ignored(url):
    """Return True when the url should be skipped due to known noise."""
    try:
        parsed = urlparse(url)
        netloc = (parsed.netloc or '').lower()
        for suf in IGNORE_HOST_SUFFIXES:
            if netloc.endswith(suf):
                return True
        low = url.lower()
        for s in IGNORE_SUBSTRINGS:
            if s in low:
                return True
    except Exception:
        return False
    return False


def check_link(session, url, timeout=10):
    try:
        # Try HEAD first
        r = session.head(url, allow_redirects=True, timeout=timeout)
        status = r.status_code
        final = r.url
        if status >= 400 or status == 0:
            # fallback to GET
            r = session.get(url, allow_redirects=True, timeout=timeout)
            status = r.status_code
            final = r.url
        return url, status, final
    except Exception as e:
        return url, None, str(e)


def main():
    links = find_links()
    ignored = [l for l in links if is_ignored(l)]
    links = [l for l in links if not is_ignored(l)]

    print(f'Found {len(links)} external links to check (skipped {len(ignored)} known-noise links)')
    if ignored:
        print('\nSkipped links:')
        for l in ignored:
            print('  -', l)

    # Prepare HTTP session with a browser-like UA and polite retries
    session = requests.Session()
    session.headers.update({'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
    retries = Retry(total=2, backoff_factor=0.6, status_forcelist=(429, 500, 502, 503, 504))
    adapter = HTTPAdapter(max_retries=retries)
    session.mount('http://', adapter)
    session.mount('https://', adapter)

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
        futures = {ex.submit(check_link, session, url): url for url in links}
        for fut in concurrent.futures.as_completed(futures):
            res = fut.result()
            results.append(res)

    # Print failures
    bad = [r for r in results if r[1] is None or (isinstance(r[1], int) and r[1] >= 400)]
    for url, status, info in bad:
        print(f'BAD: {url} -> {status} ({info})')

    print('\nSummary:')
    print(f'  Total checked: {len(results)}')
    print(f'  Failures: {len(bad)}')
    if bad:
        return 2
    return 0


if __name__ == '__main__':
    sys.exit(main())
