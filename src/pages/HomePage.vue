<template>
  <q-page class="home-page flex flex-center">
    <div class="home-content">
      <!-- Robot Avatar -->
      <div class="flex flex-center q-mb-md">
        <div class="logo-wrapper">
          <img src="~assets/logo_nova.png" alt="Logo" style="width: 110px; height: 140px;" />
        </div>
      </div>

      <!-- App Title -->
      <div class="app-title q-mb-xl">AI SALES SUPERNOVA</div>

      <!-- Greeting -->
      <div class="greeting q-mb-xs">Hola, {{ user.username}},</div>
      <div class="subtitle q-mb-xl">¿Qué quieres consultar el día de hoy?</div>

      <!-- Query Input -->
      <div class="input-wrapper">
        <q-input
          v-model="query"
          placeholder="pregunta sobre ventas, productos y clientes"
          outlined
          dense
          dark
          type="textarea"
          class="query-input"
          :loading="loading"
          :disable="loading"
          @keyup.enter="goToChat"
        >
          <template #append>
            <q-btn
              round
              flat
              icon="send"
              class="send-btn"
              size="md"
              :loading="loading"
              :disable="!query.trim() || loading"
              @click="goToChat"
            />
          </template>
        </q-input>
      </div>

      <!-- Chat History -->
      <div v-if="chatHistory.length > 0" class="history-section">
        <div class="history-header">
          <q-icon name="history" size="20px" />
          <span>Conversaciones recientes</span>
        </div>
        <div class="history-list">
          <div
            v-for="item in chatHistory.slice(0, 5)"
            :key="item.id"
            class="history-item"
            @click="loadChat(item)"
          >
            <div class="history-preview">{{ item.preview }}</div>
            <div class="history-date">{{ item.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Page label -->
    <div class="page-label">home</div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { userStore } from 'src/stores/user-store';
import { useChatStore } from 'src/stores/chat-store';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

const router = useRouter();
const query = ref('');
const user = userStore();
const chatStore = useChatStore();
const loading = ref(false);

const chatHistory = computed(() => chatStore.sortedSessions);

function loadChat(session: any) {
  router.push({
    path: '/chat',
    state: { loadSessionId: session.id }
  });
}

async function goToChat() {
  if (!query.value.trim()) return;

  loading.value = true;
  try {
    const response = await api.post('/rag/ask', {
      query: query.value,
      top_k: 2
    });

    router.push({
      path: '/chat',
      state: {
        initialQuery: query.value,
        initialResponse: response.data
      }
    });
  } catch (error: any) {
    console.error('Error al consultar:', error);

    let errorMessage = 'Error al procesar la consulta';
    let errorType = 'negative';

    if (error.response?.status === 400) {
      const detail = error.response.data?.detail || '';

      if (detail.includes('intento de inyección detectado')) {
        errorMessage = '🚫 Consulta bloqueada: Se detectó un intento de inyección. Por favor, reformula tu pregunta.';
        errorType = 'warning';
      } else if (detail.includes('lenguaje inapropiado detectado')) {
        errorMessage = '⚠️ Consulta bloqueada: Se detectó lenguaje inapropiado. Mantén un lenguaje profesional.';
        errorType = 'warning';
      } else if (detail.includes('fuera del dominio de negocio permitido')) {
        errorMessage = '📋 Consulta fuera de alcance: Solo puedo ayudarte con temas de ventas, productos y clientes.';
        errorType = 'info';
      } else {
        errorMessage = detail;
      }
    }

    Notify.create({
      type: errorType,
      message: errorMessage,
      position: 'top',
      timeout: 4000,
      actions: [{ icon: 'close', color: 'white' }]
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background-color: #0b0b28;
  background-image: url('~assets/background_home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(11, 11, 40, 0.7);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, rgba(85, 0, 212, 0.15), transparent 60%),
                radial-gradient(circle at 50% 70%, rgba(161, 0, 0, 0.1), transparent 60%);
  }
}

.page-label {
  position: absolute;
  top: 24px;
  left: 28px;
  color: #5500d4;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(85, 0, 212, 0.8);
  z-index: 10;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 520px;
  padding: 32px 24px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.logo-wrapper {
  filter: drop-shadow(0 0 30px rgba(85, 0, 212, 0.8))
          drop-shadow(0 0 60px rgba(161, 0, 0, 0.4));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.app-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(85, 0, 212, 1),
               0 0 40px rgba(161, 0, 0, 0.6);
}

.greeting {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 0 15px rgba(85, 0, 212, 0.8);
}

.subtitle {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 10px rgba(85, 0, 212, 0.5);
}

.input-wrapper {
  width: 100%;
}

.query-input {
  :deep(.q-field__control) {
    border-radius: 24px;
    background: rgba(11, 11, 40, 0.7);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(85, 0, 212, 0.6);
    box-shadow: 0 0 30px rgba(85, 0, 212, 0.4),
                inset 0 0 20px rgba(85, 0, 212, 0.1);
    transition: all 0.3s ease;
    min-height: 100px;
    align-items: flex-start;

    &:hover {
      border-color: #5500d4;
      box-shadow: 0 0 40px rgba(85, 0, 212, 0.7),
                  0 0 80px rgba(161, 0, 0, 0.3);
    }
  }

  :deep(.q-field__native) {
    color: #fff;
    font-size: 16px;
    padding: 20px 16px;
    resize: none;
  }

  :deep(input::placeholder),
  :deep(textarea::placeholder) {
    color: rgba(255, 255, 255, 0.5);
  }

  :deep(.q-field__append) {
    padding: 16px 12px 16px 0;
    align-self: flex-end;
  }
}

.send-btn {
  color: #5500d4;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    text-shadow: 0 0 10px rgba(85, 0, 212, 1);
  }
}

.history-section {
  margin-top: 40px;
  width: 100%;
  max-width: 600px;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  padding: 12px 16px;
  background: rgba(11, 11, 40, 0.6);
  border: 1px solid rgba(85, 0, 212, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(85, 0, 212, 0.2);
    border-color: #5500d4;
    box-shadow: 0 0 20px rgba(85, 0, 212, 0.4);
    transform: translateX(4px);
  }
}

.history-preview {
  font-size: 13px;
  color: #fff;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}
</style>














