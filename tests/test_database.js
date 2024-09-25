import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testDatabase() {
  const discordId = 123456789012345680; // ID de teste

  try {
    // Verificar se o usuário já existe
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('discord_id', discordId);

    if (fetchError) {
      console.error('Erro ao verificar usuários:', fetchError.message);
      return;
    }

    if (existingUsers.length === 0) {
      // Inserir um novo usuário se não existir
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([{
          discord_id: discordId,
          username: 'TesteUser',
          avatar_url: 'https://example.com/avatar.png',
          access_token: 'token_de_acesso',
          refresh_token: 'token_de_refresh'
          // Não precisa incluir created_at e updated_at, o Supabase cuidará disso
        }]);

      if (insertError) {
        console.error('Erro ao inserir usuário de teste:', insertError.message);
        return;
      }

      console.log('Usuário inserido com sucesso:', data);
    } else {
      console.log('Usuário já existe:', existingUsers);
    }

    // Buscar todos os usuários
    const { data: users, error: fetchError2 } = await supabase
      .from('users')
      .select('*');

    if (fetchError2) {
      console.error('Erro ao buscar usuários:', fetchError2.message);
      return;
    }

    if (users.length === 0) {
      console.log('A tabela "users" está vazia.');
    } else {
      console.log('A tabela "users" contém os seguintes registros:');
      console.table(users);
    }

  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  }
}

testDatabase();
