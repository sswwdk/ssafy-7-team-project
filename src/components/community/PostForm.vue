<script setup>
import { reactive, watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { POST_CATEGORY_OPTIONS } from '@/constants/storage'
import { validatePostInput } from '@/utils/validators'

const props = defineProps({
  initialPost: {
    type: Object,
    default: () => ({})
  },
  mode: {
    type: String,
    default: 'create'
  },
  submitLabel: {
    type: String,
    default: '저장'
  }
})

const emit = defineEmits(['submit', 'cancel'])
const { t } = useLocale()
const form = reactive({
  category: 'free',
  title: '',
  content: '',
  password: ''
})
const errors = reactive({})

watch(
  () => props.initialPost,
  (post) => {
    form.category = post.category || 'free'
    form.title = post.title || ''
    form.content = post.content || ''
    form.password = ''
  },
  { immediate: true }
)

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function submitForm() {
  clearErrors()
  const result = validatePostInput(form)

  if (!result.isValid) {
    Object.assign(errors, result.errors)
    return
  }

  emit('submit', result.value)
}
</script>

<template>
  <form class="form-card" @submit.prevent="submitForm">
    <div class="form-field">
      <label class="field-label" for="post-category">{{ t('카테고리') }}</label>
      <select id="post-category" v-model="form.category" class="text-input">
        <option v-for="option in POST_CATEGORY_OPTIONS" :key="option.value" :value="option.value">
          {{ t(option.label) }}
        </option>
      </select>
      <p v-if="errors.category" class="error-text">{{ t(errors.category) }}</p>
    </div>

    <div class="form-field">
      <label class="field-label" for="post-title">{{ t('제목') }}</label>
      <input id="post-title" v-model="form.title" class="text-input" maxlength="80" />
      <p v-if="errors.title" class="error-text">{{ t(errors.title) }}</p>
    </div>

    <div class="form-field">
      <label class="field-label" for="post-content">{{ t('내용') }}</label>
      <textarea
        id="post-content"
        v-model="form.content"
        class="text-input textarea-input"
        maxlength="3000"
        rows="12"
      />
      <p v-if="errors.content" class="error-text">{{ t(errors.content) }}</p>
    </div>

    <div class="form-field">
      <label class="field-label" for="post-password">
        {{ t(mode === 'create' ? '수정·삭제용 비밀번호' : '작성 시 비밀번호') }}
      </label>
      <input
        id="post-password"
        v-model="form.password"
        class="text-input"
        type="password"
        autocomplete="current-password"
        maxlength="20"
      />
      <p class="help-text">{{ t('교육용 요구사항에 따라 현재 브라우저 localStorage에 저장됩니다.') }}</p>
      <p v-if="errors.password" class="error-text">{{ t(errors.password) }}</p>
    </div>

    <div class="button-row end">
      <button class="button button-ghost" type="button" @click="emit('cancel')">{{ t('취소') }}</button>
      <button class="button button-primary" type="submit">{{ t(submitLabel) }}</button>
    </div>
  </form>
</template>
