#!/usr/bin/env python3
"""
Simple link checker for generated _site.
Scans HTML files, extracts http(s) links, and fetches them with HEAD then GET fallback.
Produces a small report with non-200 responses.
"""
import sys
import os
import re
import concurrent.futures
from urllib.parse import urljoin

import requests

ROOT = os.path.join(os.path.dirname(__file__), '..', '_site')

link_re = re.compile(r'href=["\'](http[s]?://[^"\']+)["\']', re.I)


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


def check_link(url, timeout=10):
    try:
        # Try HEAD first
        r = requests.head(url, allow_redirects=True, timeout=timeout)
        status = r.status_code
        if status >= 400 or status == 0:
            # fallback to GET
            r = requests.get(url, allow_redirects=True, timeout=timeout)
            status = r.status_code
        return url, status, r.url
    except Exception as e:
        return url, None, str(e)


def main():
    links = find_links()
    print(f'Found {len(links)} external links to check')
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
        futures = {ex.submit(check_link, url): url for url in links}
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
