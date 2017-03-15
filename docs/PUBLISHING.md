Publishing Etcher
=================

This is a small guide to package and publish Etcher to all supported operating
systems.

Release Types
-------------

Etcher supports **production** and **snapshot** releases. Each is published to
a different S3 bucket, and production releases are code signed, while snapshot
releases aren't and include a short git commit-hash as a build number. For
example, `1.0.0-beta.19` is a production release, while `1.0.0-beta.19+531ab82`
is a snapshot release.

In terms of comparison: `1.0.0-beta.19` (production) < `1.0.0-beta.19+531ab82`
(snapshot) < `1.0.0` (production) < `1.0.0+2201e5f` (snapshot).

The build system creates snapshot releases by default, but you can build a
specific release type by setting the `RELEASE_TYPE` environment variable. For
example:

```sh
make <target> RELEASE_TYPE=snapshot
make <target> RELEASE_TYPE=production
```

Signing
-------

### OS X

1. Get our Apple Developer ID certificate for signing applications distributed
outside the Mac App Store from the resin.io Apple account.

2. Install the Developer ID certificate to your Mac's Keychain by double
clicking on the certificate file.

The application will be signed automatically using this certificate when
packaging for OS X.

### Windows

1. Get access to our code signing certificate and decryption key as a resin.io
employee by asking for it from the relevant people.

2. Place the certificate in the root of the Etcher repository naming it
`certificate.p12`.

Packaging
---------

The resulting installers will be saved to `release/out`.

Run the following commands:

### OS X

```sh
make electron-installer-dmg
make electron-installer-app-zip
```

### GNU/Linux

```sh
make electron-installer-appimage
make electron-installer-debian
```

### Windows

```sh
make electron-installer-zip
make electron-installer-nsis
```

Publishing to Bintray
---------------------

We publish GNU/Linux Debian packages to [Bintray][bintray].

Make sure you set the following environment variables:

- `BINTRAY_USER`
- `BINTRAY_API_KEY`

Run the following command:

```sh
make publish-bintray-debian
```

Publishing to S3
----------------

- [AWS CLI][aws-cli]

Make sure you have the [AWS CLI tool][aws-cli] installed and configured to
access resin.io's production or snapshot S3 bucket.

Run the following command to publish all files for the current combination of
_platform_ and _arch_ (building them if necessary):

```sh
make publish-aws-s3
```

Also add links to each AWS S3 file in [GitHub Releases][github-releases]. See
[`v1.0.0-beta.17`](https://github.com/resin-io/etcher/releases/tag/v1.0.0-beta.17)
as an example.

Publishing to Homebrew Cask
---------------------------

1. Update [`Casks/etcher.rb`][etcher-cask-file] with the new version and
   `sha256`

2. Send a PR with the changes above to
   [`caskroom/homebrew-cask`][homebrew-cask]

Announcing
----------

Post messages to the [Etcher forum][resin-forum-etcher] and
[Etcher gitter channel][gitter-etcher] announcing the new version
of Etcher, and including the relevant section of the Changelog.

[aws-cli]: https://aws.amazon.com/cli
[bintray]: https://bintray.com
[etcher-cask-file]: https://github.com/caskroom/homebrew-cask/blob/master/Casks/etcher.rb
[homebrew-cask]: https://github.com/caskroom/homebrew-cask
[resin-forum-etcher]: https://talk.resin.io/c/etcher/annoucements
[gitter-etcher]: https://gitter.im/resin-io/etcher
[github-releases]: https://github.com/resin-io/etcher/releases
