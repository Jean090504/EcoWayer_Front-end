# Alterações do TCC — interface

Esta branch reúne as mudanças recentes nas interfaces de usuário e administrador:

- Assistente EcoWayer no site do usuário e assistente contextual no painel administrativo. A URL da API de IA é configurada pelos arquivos `.env.example` de cada aplicação.
- Tela de chamados ligada aos alertas pendentes da API, com busca, filtros e dois detalhes: alerta da IA e denúncia. As ações registram a decisão do administrador no chamado.
- Categorias e itens com exclusão confirmada, exibição de imagem e envio de imagem no cadastro de item.
- Painel de pontuação com categorias e condições cadastradas, cálculo no backend e legenda dos multiplicadores.
- Pontos de coleta com consulta a dados públicos do OpenStreetMap e opção de cadastrar um ponto encontrado.

Os chamados marcados como `Teste TCC` são exemplos criados pelo script do backend. Suas justificativas são dados de demonstração, não resultados reais da IA. O banco atual não possui status de moderação do anúncio; por isso, as ações dos chamados registram a decisão, mas não ocultam o anúncio da plataforma.

Não adicione chaves reais aos arquivos `.env.example` nem faça commit dos arquivos `.env` locais.
