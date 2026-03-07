-- Adiciona colunas opcionais em dose_records (peso no momento e próxima dose)
-- Execute no Neon se o registro de dose falhar com erro de coluna.

ALTER TABLE dose_records
  ADD COLUMN IF NOT EXISTS weight_kg_at_moment NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS next_dose_scheduled_at TIMESTAMP;
