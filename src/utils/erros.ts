export const mensagensDeERRO = {
    validacao: {
        emailInvalido: "Por favor, insira um endereço de e-mail válido.",
        cpfInvalido: "O CPF deve ser um CPF válido",
        senhaFraca: "A senha deve conter: 8 a 12 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.",
        campoObrigatorio: "Este campo não pode ficar vazio.",
        senhasDiferentes: "As senhas não se condizem, verificar erros de digitação."
    },

    api: {
        generico: "Não foi possível conectar ao servidor. Verifique sua internet.",
        credenciaisInvalidas: "CPF/E-mail ou senha incorretos. Tente novamente.",
        usuarioBloqueado: "Sua conta foi temporariamente bloqueada por segurança.",
        servidorForaDoAr: "Não foi possivel realizar a ação. Servidor está fora do ar/indisponivel",
        timeout: "O servidor demorou muito para responder."
    },

    preencherCampo: {
        nome: "O nome deve ter no minimo 3 caracteres e não pode ultrapassar 100 caracteres.",
        telefone: "Telefone inválido, insirá um telefone válido",
        idade: "Você precisa ter pelo menos 18 anos para se cadastrar na aplicação",
        cep: "Insira um CEP valido.",
        rua: "O campo rua é obrigatório, insira o nome da rua.",
        bairro: "O campo bairro é obrigatório, insira o nome do bairro",
        numero: "O numero da residência é obrigatório, insira o numero",
    }
}