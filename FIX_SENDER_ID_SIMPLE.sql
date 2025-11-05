-- Soluzione più semplice: disabilita RLS temporaneamente, cambia tipo, riabilita

-- 1. Disabilita RLS sulla tabella messages
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 2. Rimuovi le foreign key constraints
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

-- 3. Cambia il tipo di sender_id da UUID a TEXT
ALTER TABLE messages 
ALTER COLUMN sender_id TYPE text USING sender_id::text;

-- 4. Ricrea la foreign key verso profiles
ALTER TABLE messages
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 5. Riabilita RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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

-- 7. Verifica
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'messages' AND column_name = 'sender_id';
