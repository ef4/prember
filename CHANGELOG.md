# Changelog

## 1.1.0 - 2021-12-23

ENHANCEMENT: Add embroider support by @simonihmig

## 1.0.5 - 2020-07-01

BUGFIX: Use rootUrl for static files #57 from @mansona

## 1.0.4 - 2020-05-03 

ENHANCEMENT: Allow passing urls from prember

## 1.0.3 - 2019-05-29

ENHANCEMENT: Support to ember-engines out of the box

## 1.0.2 - 2019-01-06

BUGFIX: The protocol bugfix in 1.0.1 was not quite right and caused a regresion.

## 1.0.1 - 2018-12-20

BUGFIX: Shutdown express server after build (thanks @astronomersiva)
BUGFIX: Add protocol to fastboot requests for improved compatibility (thanks @xg-wang)

## 1.0.0 - 2018-10-28

BREAKING: We now require ember-cli-fastboot >= 2.0.0, and if you're using broccoli-asset-rev it should be >= 2.7.0. This is to fix the order in which these run relative to prember, so that all asset links will get correct handling.

## 0.4.0 - 2018-04-25

BREAKING: the signature for custom url discovery functions has changed from

    async function(distDir, visit) { return [...someURLs] }

to

    async function({ distDir, visit }) { return [...someURLs] }

This makes it nicer to compose multiple URL discovery strategies.
