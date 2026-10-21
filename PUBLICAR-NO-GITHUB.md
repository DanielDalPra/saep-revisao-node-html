# Publicar quando a autenticação estiver disponível

O repositório Git local está pronto. O destino já foi criado pelo usuário: https://github.com/DanielDalPra/saep-revisao-node-html. O terminal isolado não enxerga uma credencial válida, e o conector está autenticado em outra conta sem permissão de escrita nesse destino.

Dentro desta pasta, autentique na conta desejada:

```powershell
gh auth login
gh api user --jq .login
```

Confira o nome da conta retornado. Depois:

```powershell
git push -u origin main
```

Esse comando envia o commit local ao remoto origin já configurado. O destino foi criado como público pelo usuário. Não use force push. Se o CLI pedir configuração do protocolo Git, escolha HTTPS.

Se preferir, após se autenticar, volte ao chat e peça para concluir a publicação. Não envie token nem senha no chat.
