-- ============================================
-- RIABILITA RLS CON FIREBASE AUTH
-- ============================================
-- Questo script riabilita Row Level Security
-- con policy che usano il JWT di Firebase
-- ============================================

-- 1. Abilita RLS su tutte le tabelle
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop policy esistenti (se presenti)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

-- 3. Policy per PROFILES
-- Gli utenti possono vedere e modificare solo il proprio profilo
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (id = auth.jwt() ->> 'user_id');

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (id = auth.jwt() ->> 'user_id');

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (id = auth.jwt() ->> 'user_id');

-- 4. Policy per CONVERSATIONS
-- Gli utenti possono vedere solo le conversazioni in cui sono partecipanti
CREATE POLICY "Users can view their conversations"
ON conversations FOR SELECT
USING (student_id = auth.jwt() ->> 'user_id');

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (student_id = auth.jwt() ->> 'user_id');

-- 5. Policy per MESSAGES
-- Gli utenti possono vedere i messaggi nelle loro conversazioni
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.student_id = auth.jwt() ->> 'user_id'
  )
);

-- Gli utenti possono inviare messaggi nelle loro conversazioni
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (
  sender_id = auth.jwt() ->> 'user_id'
  AND EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND conversations.student_id = auth.jwt() ->> 'user_id'
  )
);

-- Gli utenti possono eliminare solo i propri messaggi
CREATE POLICY "Users can delete their own messages"
ON messages FOR DELETE
USING (sender_id = auth.jwt() ->> 'user_id');

-- 6. Permetti ai tutor di vedere tutte le conversazioni e messaggi
CREATE POLICY "Tutors can view all conversations"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.jwt() ->> 'user_id'
    AND profiles.role = 'tutor'
  )
);

CREATE POLICY "Tutors can view all messages"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.jwt() ->> 'user_id'
    AND profiles.role = 'tutor'
  )
);

CREATE POLICY "Tutors can send messages"
ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.jwt() ->> 'user_id'
    AND profiles.role = 'tutor'
  )
);

-- ============================================
-- VERIFICA
-- ============================================
-- Controlla che RLS sia abilitato
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'conversations', 'messages');

-- Expected output: rowsecurity = true per tutte le tabelle

-- Controlla le policy create
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
