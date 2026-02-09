SELECT current_database() as db, current_schema() as schema;

SELECT n.nspname as schema, t.typname as type_name
FROM pg_type t
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE t.typname = 'JobStatus';
