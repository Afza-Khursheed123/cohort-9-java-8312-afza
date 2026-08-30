# Database rollout migrations

Run these SQL Server scripts in numeric order before deploying the corresponding application change.

For `002_backfill_contact_owners.sql`, choose the existing account that should own all contacts created before ownership was introduced, then run:

```powershell
sqlcmd -S <server> -d <database> -v LegacyContactOwnerIdentifier="owner@example.com" -i 002_backfill_contact_owners.sql
```

The script verifies that the identifier resolves to exactly one user, backfills every null `owner_id`, verifies the result, and makes `owner_id` non-null in one transaction. Take a database backup and validate the selected owner with the data owner before rollout.
