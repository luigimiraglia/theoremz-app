-- Script per aggiungere messaggi dal tutor nella chat

-- 1. Prima verifica l'ID della conversazione dello studente
SELECT id, student_id, created_at 
FROM conversations 
WHERE student_id = 'WA3GgIiy7GeNJqKUcYhoYoDAEEC3' -- Il tuo Firebase UID
ORDER BY created_at DESC 
LIMIT 1;

-- 2. Inserisci un messaggio dal tutor
-- Sostituisci <conversation_id> con l'ID ottenuto dalla query sopra
INSERT INTO messages (conversation_id, sender_id, body)
VALUES (
  '<conversation_id>', -- ID della conversazione (es: 'a1b2c3d4-...')
  'tutor_001',         -- ID del tutor
  'Ciao! Sono qui per aiutarti con i tuoi dubbi di matematica e fisica. Come posso esserti utile?'
);

-- 3. Esempio: aggiungi più messaggi dal tutor
INSERT INTO messages (conversation_id, sender_id, body)
VALUES 
  ('<conversation_id>', 'tutor_001', 'Ho visto che hai dubbi sull''analisi matematica. Vuoi che ripassiamo insieme i limiti?'),
  ('<conversation_id>', 'tutor_001', 'Ricorda che puoi anche inviarmi formule matematiche usando LaTeX, ad esempio: $\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$');

-- 4. Query veloce per vedere tutti i messaggi della conversazione
SELECT 
  m.id,
  m.sender_id,
  m.body,
  m.created_at,
  CASE 
    WHEN m.sender_id = 'tutor_001' THEN 'Tutor'
    ELSE 'Studente'
  END as sender_type
FROM messages m
WHERE m.conversation_id = '<conversation_id>'
ORDER BY m.created_at ASC;
