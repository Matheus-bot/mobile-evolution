# 09 — Feedback & Estatísticas (Firebase)

A seção discreta no rodapé da página (`#feedback` em [index.html](../index.html)) permite que visitantes avaliem a experiência de 1 a 5 estrelas e veem, em tempo real, a média de avaliações, o total de avaliações e o total de visitas. Toda a lógica vive em [assets/js/feedback.js](../assets/js/feedback.js) e os dados são persistidos no **Firebase Firestore**.

## 1. Criar o projeto Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e crie um novo projeto (pode desativar o Google Analytics, não é usado aqui).
2. No menu lateral, abra **Build > Firestore Database** e clique em **Criar banco de dados**.
   - Escolha o modo **produção** (as regras de segurança abaixo cobrem o caso de uso).
   - Selecione a região mais próxima do seu público.
3. Em **Configurações do projeto** (ícone de engrenagem) > aba **Geral** > seção **Seus apps**, clique no ícone `</>` para registrar um Web App. Não é necessário Firebase Hosting.
4. Copie o objeto `firebaseConfig` exibido — você vai colar ele no próximo passo.

## 2. Inserir as credenciais no projeto

Abra [assets/js/firebase-config.js](../assets/js/firebase-config.js) e substitua os valores de placeholder pelos dados copiados do console:

```js
const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_PROJETO.firebaseapp.com',
  projectId: 'SEU_PROJETO',
  storageBucket: 'SEU_PROJETO.appspot.com',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID',
};
```

Esse arquivo já é carregado em [index.html](../index.html), antes de `feedback.js`, então nenhuma outra alteração é necessária. As chaves do Firebase Web SDK são públicas por design (não são segredos) — a proteção real vem das regras do Firestore, no próximo passo.

## 3. Regras de segurança do Firestore

Como a página não usa login, qualquer visitante pode incrementar os contadores. Para evitar abuso (ex.: alguém sobrescrevendo o documento com valores arbitrários), restrinja as regras para permitir apenas leitura pública e updates incrementais no único documento usado:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stats/global {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['visits', 'ratings', 'totalScore']);
      allow update: if request.resource.data.diff(resource.data).affectedKeys()
                      .hasOnly(['visits', 'ratings', 'totalScore']);
      allow delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Cole essas regras em **Firestore Database > Regras** no console e publique.

## 4. Estrutura de dados

Um único documento guarda tudo:

```
stats (coleção)
  └── global (documento)
        visits: number       // total de carregamentos da página
        ratings: number      // total de avaliações enviadas
        totalScore: number   // soma de todas as notas (1-5)
```

A **média** (`totalScore / ratings`) é calculada no cliente em tempo real — não existe um campo `average` no Firestore, para evitar que ele fique dessincronizado.

## 5. Como funciona

- **Visita**: a cada carregamento da página, `registerVisit()` incrementa `visits` via `FieldValue.increment(1)` (operação atômica, criando o documento se ainda não existir).
- **Avaliação**: ao clicar em "Avaliar", `submitRating()` incrementa `ratings` e soma o valor escolhido a `totalScore`.
- **Anti-duplicidade**: ao enviar uma avaliação, o navegador grava a chave `mobileEvolutionFeedbackRated` no `localStorage`. Em visitas futuras do mesmo navegador, as estrelas e o botão ficam ocultos e apenas a mensagem "Obrigado pela sua avaliação!" é exibida. Isso é uma barreira de UX, não de segurança — não impede reenvios via DevTools.
- **Estatísticas em tempo real**: a UI usa `onSnapshot` no documento `stats/global`, então a média, o total de avaliações e o total de visitas se atualizam automaticamente sem precisar recarregar a página.

## 6. Testando localmente

Basta abrir `index.html` normalmente (ou via Live Server). Com as credenciais configuradas, a seção de feedback já se conecta ao Firestore. Se o console mostrar `Firebase não inicializado`, confira se `assets/js/firebase-config.js` foi preenchido corretamente.
