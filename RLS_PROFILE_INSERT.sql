-- Disabilita RLS sulla tabella profiles
-- Questo permette l'inserimento del profilo senza ricorsione
-- Le altre tabelle (conversations, messages) mantengono RLS attivo

-- Disabilita RLS per profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Rimuovi tutte le vecchie policy da profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation on first login" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Verifica che RLS sia disabilitato
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Verifica che le policy per conversations e messages siano ancora attive
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('conversations', 'messages')
ORDER BY tablename, policyname;
