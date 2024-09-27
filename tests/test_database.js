import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function formatDateForBrazil(utcDate) {
  const options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const formatter = new Intl.DateTimeFormat('pt-BR', options);
  return formatter.format(new Date(utcDate));
}

async function testDatabase() {
  const discordId = 123456789012345680;
  
  // Simulação dos dados do usuário
  const newUserData = {
    discord_id: discordId,
    username: 'NovoUsuarioTeste',
    avatar_url: 'https://example.com/avatar_novo.png',
    access_token: 'novo_token_de_acesso',
    refresh_token: 'novo_token_de_refresh'
  };

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
      // Se o usuário não existir, insere um novo
      console.log('Usuário não existe, inserindo novo usuário...');
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([newUserData]);

      if (insertError) {
        console.error('Erro ao inserir usuário:', insertError.message);
        return;
      }

      console.log('Usuário inserido com sucesso:', data);
    } else {
      const existingUser = existingUsers[0];

      // Exibir a data formatada no horário do Brasil
      const createdAtInBrazil = formatDateForBrazil(existingUser.created_at);
      console.log('Data de criação formatada:', createdAtInBrazil);
    }

  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  }
}

testDatabase();