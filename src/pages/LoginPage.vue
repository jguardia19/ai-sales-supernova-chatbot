<template>
  <q-page class="login-page flex flex-center">
    <div class="login-card">
      <!-- Robot Avatar -->
      <div class="avatar-wrapper">
        <img src="~assets/logo_nova.png" alt="Logo" style="width: 90px; height: 110px;" />
      </div>

      <!-- Form -->
      <div class="login-form">
        <q-input
          v-model="username"
          placeholder="usuario"
          dense
          outlined
          bg-color="transparent"
          class="login-input q-mb-sm"
        />
        <q-input
          v-model="password"
          placeholder="contraseña"
          type="password"
          dense
          outlined
          class="login-input q-mb-md"
          dark
        />
        <q-btn
          label="Ingresar"
          class="login-btn full-width"
          unelevated
          no-caps
          @click="handleLogin"
        />
      </div>
    </div>

    <!-- Page label -->
    <div class="page-label">login</div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

function handleLogin() {
  router.push('/home');
}
</script>

<style scoped lang="scss">
.login-page {
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
    background: radial-gradient(circle at 30% 50%, rgba(85, 0, 212, 0.15), transparent 50%),
                radial-gradient(circle at 70% 50%, rgba(161, 0, 0, 0.1), transparent 50%);
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

.login-card {
  background: rgba(11, 11, 40, 0.95);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(85, 0, 212, 0.5);
  border-radius: 20px;
  padding: 0 32px 32px 32px;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 40px rgba(85, 0, 212, 0.4),
              0 0 80px rgba(161, 0, 0, 0.2),
              inset 0 0 60px rgba(85, 0, 212, 0.1);
  position: relative;
  z-index: 1;
}

.avatar-wrapper {
  margin-top: -50px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(85, 0, 212, 0.3), rgba(161, 0, 0, 0.3));
  border: 3px solid #5500d4;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 0 30px rgba(85, 0, 212, 0.8),
              0 0 60px rgba(161, 0, 0, 0.4);
}

.login-form {
  width: 100%;
}

.login-input {
  :deep(.q-field__control) {
    border-radius: 10px;
    background: rgba(11, 11, 40, 0.6);
    border: 1px solid rgba(85, 0, 212, 0.5);
    color: #fff;
    background-color: transparent !important;

    &::before {
      border: none;
    }
  }

  :deep(.q-field__native) {
    color: #fff;
  }

  :deep(input::placeholder) {
    color: rgba(255, 255, 255, 0.5);
  }

  &:hover :deep(.q-field__control) {
    border-color: #5500d4;
    box-shadow: 0 0 15px rgba(85, 0, 212, 0.5);
  }
}

.login-btn {
  background: linear-gradient(135deg, #5500d4, #a10000);
  color: white;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 0 20px rgba(85, 0, 212, 0.6),
              0 0 40px rgba(161, 0, 0, 0.4);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 30px rgba(85, 0, 212, 0.9),
                0 0 60px rgba(161, 0, 0, 0.6);
    transform: translateY(-2px);
  }
}
</style>



