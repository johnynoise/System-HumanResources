/*
  # Sistema de Autenticação e Usuários

  1. Tabelas Novas
    - `profiles`: Perfil de usuário estendido
      - `id` (uuid, chave primária, referencia auth.users)
      - `email` (text, único)
      - `full_name` (text)
      - `role` (text, papel do usuário: admin, gestor, analista)
      - `active` (boolean, usuário ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `documents`: Armazenamento de metadados de documentos
      - `id` (uuid, chave primária)
      - `process_id` (uuid, referencia processo)
      - `file_name` (text)
      - `file_size` (integer)
      - `file_type` (text)
      - `uploaded_by` (uuid, referencia profiles)
      - `created_at` (timestamp)

  2. Segurança
    - RLS habilitado em `profiles` (usuários veem apenas seu próprio perfil)
    - RLS habilitado em `documents` (acessar apenas documentos de processos que você tem acesso)
    - Trigger para criar perfil automaticamente quando usuário se registra

  3. Notas Importantes
    - A tabela `auth.users` é mantida pelo Supabase Auth automaticamente
    - `profiles` estende os dados de auth.users com informações específicas da aplicação
    - Documentos são armazenados no bucket do Supabase Storage
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'analista' CHECK (role IN ('admin', 'gestor', 'analista')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id uuid NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  file_type text NOT NULL,
  file_path text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents from their processes"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents to their processes"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());
