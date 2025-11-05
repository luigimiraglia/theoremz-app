-- Fix: Cambia il tipo di sender_id da UUID a TEXT per supportare Firebase UID
-- Firebase UID è una stringa (text), non un UUID

-- 1. Prima vedi tutte le policy esistenti
-- Esegui questa query separatamente per vedere tutte le policy da rimuovere:
-- SELECT policyname FROM pg_policies WHERE tablename = 'messages';

-- 2. Rimuovi TUTTE le policy da messages
DROP POLICY IF EXISTS "Students view own conv messages" ON messages;
DROP POLICY IF EXISTS "Tutors view all messages" ON messages;
DROP POLICY IF EXISTS "Students send in own conv" ON messages;
DROP POLICY IF EXISTS "Tutors send in any conv" ON messages;
DROP POLICY IF EXISTS "tutor sends in any conv" ON messages;
DROP POLICY IF EXISTS "Students delete own messages" ON messages;
DROP POLICY IF EXISTS "student sends in own conv if subscribed" ON messages;
DROP POLICY IF EXISTS "students view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "tutors view all messages" ON messages;
DROP POLICY IF EXISTS "students send messages in their conversations" ON messages;
DROP POLICY IF EXISTS "tutors send messages in any conversation" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can view messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

-- 3. Rimuovi le foreign key constraints
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

-- 4. Cambia il tipo di sender_id da UUID a TEXT
ALTER TABLE messages 
ALTER COLUMN sender_id TYPE text USING sender_id::text;

-- 5. Ricrea la foreign key verso profiles (che usa text come PK)
ALTER TABLE messages
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 6. Ricrea le policy RLS
CREATE POLICY "Students view own conv messages"
ON messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE student_id = auth.jwt() ->> 'user_id'
  )
);

CREATE POLICY "Tutors view all messages"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.jwt() ->> 'user_id' AND role = 'tutor'
  )
);

CREATE POLICY "Students send in own conv"
ON messages FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations WHERE student_id = auth.jwt() ->> 'user_id'
  )
  AND sender_id = auth.jwt() ->> 'user_id'
);

CREATE POLICY "Tutors send in any conv"
ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.jwt() ->> 'user_id' AND role = 'tutor'
  )
  AND sender_id = auth.jwt() ->> 'user_id'
);

CREATE POLICY "Students delete own messages"
ON messages FOR DELETE
USING (
  sender_id = auth.jwt() ->> 'user_id'
  AND conversation_id IN (
    SELECT id FROM conversations WHERE student_id = auth.jwt() ->> 'user_id'
  )
);

-- 7. Verifica la struttura della tabella
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;
