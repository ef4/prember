# 0.4.0

BREAKING: the signature for custom url discovery functions has changed from

    async function(distDir, visit) { return [...someURLs] }

to

    async function({ distDir, visit }) { return [...someURLs] }

This makes it nicer to compose multiple URL discovery strategies.
