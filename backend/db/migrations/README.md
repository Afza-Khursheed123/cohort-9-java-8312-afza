# Database rollout migrations

Run these SQL Server scripts in numeric order before deploying the corresponding application change.

For `002_backfill_contact_owners.sql`, choose the existing account that should own all contacts created before ownership was introduced. Escape single quotes before passing the identifier to SQLCMD:

```powershell
$ownerIdentifier = "owner@example.com"
$escapedOwnerIdentifier = $ownerIdentifier.Replace("'", "''")
sqlcmd -S <server> -d <database> -v LegacyContactOwnerIdentifierSqlEscaped="$escapedOwnerIdentifier" -i 002_backfill_contact_owners.sql
```

The script verifies that the identifier resolves to exactly one user, backfills every null `owner_id`, verifies the result, and makes `owner_id` non-null in one transaction. Back up the database and confirm the selected legacy owner before rollout.
