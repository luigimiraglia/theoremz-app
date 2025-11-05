-- Realtime è già abilitato! Verifica le policy RLS

-- 1. Verifica le policy SELECT (necessarie per realtime)
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'messages' AND cmd = 'SELECT';

-- 2. Verifica che RLS sia attivo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'messages';

-- 3. Se realtime non funziona, potrebbe essere un problema di autenticazione
-- Il realtime usa il client base (anon key) senza JWT
-- Soluzione: crea una policy permissiva per SELECT che permetta al client anon di leggere

-- TEMPORANEO: Disabilita RLS per testare se è quello il problema
-- ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 4. Oppure aggiungi una policy che permetta realtime
-- Questa policy permette a tutti di LEGGERE i messaggi (solo lettura, non scrittura)
DROP POLICY IF EXISTS "Allow realtime read" ON messages;
CREATE POLICY "Allow realtime read"
ON messages FOR SELECT
USING (true);  -- Permetti lettura a tutti per realtime

-- 5. Test: aggiungi un messaggio e vedi se arriva
-- Esegui questo in un'altra tab mentre l'app è aperta
-- INSERT INTO messages (conversation_id, sender_id, body)
-- VALUES ('TUO_CONVERSATION_ID', 'tutor_001', 'Test realtime message!');
