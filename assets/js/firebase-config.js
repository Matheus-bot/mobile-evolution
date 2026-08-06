/* =================================================================
   FIREBASE-CONFIG.JS
   Credenciais e inicialização do Firebase para a seção de
   Feedback/Estatísticas (assets/js/feedback.js).

   Como configurar (veja também docs/09-firebase-feedback.md):
   1. Crie um projeto em https://console.firebase.google.com
   2. Ative o Firestore Database (modo produção ou teste).
   3. Em "Configurações do projeto" > "Geral" > "Seus apps", crie um
      Web App e copie o objeto de configuração fornecido.
   4. Substitua os valores abaixo pelas suas credenciais.
   ================================================================= */

const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_PROJETO.firebaseapp.com',
  projectId: 'SEU_PROJETO',
  storageBucket: 'SEU_PROJETO.appspot.com',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID',
};

firebase.initializeApp(firebaseConfig);
