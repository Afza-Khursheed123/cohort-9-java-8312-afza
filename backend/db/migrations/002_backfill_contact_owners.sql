-- Run this SQL Server rollout migration before deploying owner-scoped contact access.
-- Supply LegacyContactOwnerIdentifier with sqlcmd's -v option. The transaction
-- fails without changing data if that identifier does not name exactly one user.

SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @legacy_owner_identifier nvarchar(254) = N'$(LegacyContactOwnerIdentifier)';
DECLARE @legacy_owner_id bigint;

IF (SELECT COUNT(*) FROM users WHERE identifier = @legacy_owner_identifier) <> 1
    THROW 50001, 'LegacyContactOwnerIdentifier must identify exactly one existing user.', 1;

SELECT @legacy_owner_id = id
FROM users
WHERE identifier = @legacy_owner_identifier;

UPDATE contacts
SET owner_id = @legacy_owner_id
WHERE owner_id IS NULL;

IF EXISTS (SELECT 1 FROM contacts WHERE owner_id IS NULL)
    THROW 50002, 'Contact owner backfill did not assign every legacy contact.', 1;

ALTER TABLE contacts ALTER COLUMN owner_id bigint NOT NULL;

COMMIT TRANSACTION;
