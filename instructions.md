# Welcome to Originless

Originless is an anonymous file and static-site host backed by IPFS.

## Using the Service

1. Start the service.
2. Open `Launch UI` to use the built-in upload page and examples.
3. Use the same address for API requests such as `/upload`, `/uploadzip`,
   `/remoteupload`, `/health`, and `/status`.

## Pin Management

Originless generates a persistent Daku keypair the first time it starts.
Run the `Get Pin Management Keys` action to view the public and private keys.

Use that keypair to authenticate requests to:

- `/pin/add`
- `/pin/list`
- `/pin/remove`

## Configuration

Run the `Configure Originless` action to adjust:

- the IPFS storage limit
- the upload size limit
- the remote upload size limit
- additional Daku public keys allowed to manage pins

## Notes

- Uploads are anonymous.
- Unpinned content may be garbage-collected.
- The `IPFS Peer` interface exposes the embedded Kubo TCP peer port.
