<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { usePosts } from '@/composables/usePosts'
import { ROUTE_NAMES } from '@/constants/routes'
import { POST_CATEGORY_OPTIONS } from '@/constants/storage'
import {
  createComment,
  createReply,
  deleteComment as removeComment,
  deleteReply as removeReply,
  getPostCommentCount,
  updateComment,
  updateReply
} from '@/services/postStorageService'
import { formatDateTime } from '@/utils/date'
import { validateCommentInput } from '@/utils/validators'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const { findPost, removePost, toggleRecommendation } = usePosts()
const post = ref(null)
const isDeleteModalOpen = ref(false)
const deleteError = ref('')
const commentForm = reactive({ content: '', password: '' })
const commentErrors = reactive({})
const commentError = ref('')
const editingCommentId = ref('')
const editCommentForm = reactive({ content: '', password: '' })
const editCommentErrors = reactive({})
const commentToDelete = ref(null)
const commentDeleteError = ref('')
const replyingCommentId = ref('')
const replyForm = reactive({ content: '', password: '' })
const replyErrors = reactive({})
const replyError = ref('')
const editingReplyId = ref('')
const editingReplyCommentId = ref('')
const editReplyForm = reactive({ content: '', password: '' })
const editReplyErrors = reactive({})
const replyToDelete = ref(null)
const replyDeleteError = ref('')

const categoryLabel = computed(
  () =>
    POST_CATEGORY_OPTIONS.find((option) => option.value === post.value?.category)?.label || '기타'
)
const comments = computed(() => post.value?.comments || [])
const totalCommentCount = computed(() => getPostCommentCount(post.value))
const recommendationCount = computed(() => Number(post.value?.recommendationCount) || 0)

onMounted(() => {
  post.value = findPost(props.id)
})

function deletePost(password) {
  deleteError.value = ''

  try {
    removePost(props.id, password)
    router.push({ name: ROUTE_NAMES.POSTS })
  } catch (error) {
    deleteError.value = error.message
  }
}

function refreshPost() {
  post.value = findPost(props.id)
}

function togglePostRecommendation() {
  post.value = toggleRecommendation(props.id)
}

function clearErrors(errors) {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function submitComment() {
  clearErrors(commentErrors)
  commentError.value = ''
  const result = validateCommentInput(commentForm)

  if (!result.isValid) {
    Object.assign(commentErrors, result.errors)
    return
  }

  try {
    createComment(props.id, result.value)
    commentForm.content = ''
    commentForm.password = ''
    refreshPost()
  } catch (error) {
    commentError.value = error.message
  }
}

function startEditingComment(comment) {
  editingCommentId.value = comment.id
  editCommentForm.content = comment.content
  editCommentForm.password = ''
  clearErrors(editCommentErrors)
  commentError.value = ''
}

function cancelEditingComment() {
  editingCommentId.value = ''
  editCommentForm.content = ''
  editCommentForm.password = ''
  clearErrors(editCommentErrors)
  commentError.value = ''
}

function submitCommentEdit(commentId) {
  clearErrors(editCommentErrors)
  commentError.value = ''
  const result = validateCommentInput(editCommentForm)

  if (!result.isValid) {
    Object.assign(editCommentErrors, result.errors)
    return
  }

  try {
    updateComment(props.id, commentId, result.value, result.value.password)
    cancelEditingComment()
    refreshPost()
  } catch (error) {
    commentError.value = error.message
  }
}

function openCommentDeleteModal(comment) {
  commentToDelete.value = comment
  commentDeleteError.value = ''
}

function closeCommentDeleteModal() {
  commentToDelete.value = null
  commentDeleteError.value = ''
}

function deleteSelectedComment(password) {
  commentDeleteError.value = ''

  try {
    removeComment(props.id, commentToDelete.value.id, password)
    closeCommentDeleteModal()
    refreshPost()
  } catch (error) {
    commentDeleteError.value = error.message
  }
}

function startReplying(commentId) {
  cancelEditingReply()
  replyingCommentId.value = commentId
  replyForm.content = ''
  replyForm.password = ''
  clearErrors(replyErrors)
  replyError.value = ''
  commentError.value = ''
}

function cancelReplying() {
  replyingCommentId.value = ''
  replyForm.content = ''
  replyForm.password = ''
  clearErrors(replyErrors)
  replyError.value = ''
}

function submitReply(commentId) {
  clearErrors(replyErrors)
  replyError.value = ''
  const result = validateCommentInput(replyForm)

  if (!result.isValid) {
    Object.assign(replyErrors, result.errors)
    return
  }

  try {
    createReply(props.id, commentId, result.value)
    cancelReplying()
    refreshPost()
  } catch (error) {
    replyError.value = error.message
  }
}

function startEditingReply(commentId, reply) {
  cancelReplying()
  editingReplyCommentId.value = commentId
  editingReplyId.value = reply.id
  editReplyForm.content = reply.content
  editReplyForm.password = ''
  clearErrors(editReplyErrors)
  replyError.value = ''
}

function cancelEditingReply() {
  editingReplyCommentId.value = ''
  editingReplyId.value = ''
  editReplyForm.content = ''
  editReplyForm.password = ''
  clearErrors(editReplyErrors)
  replyError.value = ''
}

function submitReplyEdit(commentId, replyId) {
  clearErrors(editReplyErrors)
  replyError.value = ''
  const result = validateCommentInput(editReplyForm)

  if (!result.isValid) {
    Object.assign(editReplyErrors, result.errors)
    return
  }

  try {
    updateReply(props.id, commentId, replyId, result.value, result.value.password)
    cancelEditingReply()
    refreshPost()
  } catch (error) {
    replyError.value = error.message
  }
}

function openReplyDeleteModal(commentId, reply) {
  replyToDelete.value = { commentId, reply }
  replyDeleteError.value = ''
}

function closeReplyDeleteModal() {
  replyToDelete.value = null
  replyDeleteError.value = ''
}

function deleteSelectedReply(password) {
  replyDeleteError.value = ''

  try {
    removeReply(
      props.id,
      replyToDelete.value.commentId,
      replyToDelete.value.reply.id,
      password
    )
    closeReplyDeleteModal()
    refreshPost()
  } catch (error) {
    replyDeleteError.value = error.message
  }
}
</script>

<template>
  <div class="container narrow-container page-stack">
    <article v-if="post" class="detail-card">
      <div class="post-card-meta">
        <span class="badge">{{ categoryLabel }}</span>
        <time :datetime="post.createdAt">작성 {{ formatDateTime(post.createdAt) }}</time>
      </div>
      <h1>{{ post.title }}</h1>
      <p class="post-content">{{ post.content }}</p>
      <p v-if="post.updatedAt !== post.createdAt" class="help-text">
        최종 수정 {{ formatDateTime(post.updatedAt) }}
      </p>
      <div class="post-detail-footer">
        <button
          type="button"
          class="post-recommend-button"
          :class="{ 'is-active': post.isRecommended }"
          :aria-pressed="Boolean(post.isRecommended)"
          @click="togglePostRecommendation"
        >
          <span aria-hidden="true">👍</span>
          <span>추천</span>
          <strong>{{ recommendationCount }}</strong>
        </button>
        <div class="button-row end">
          <RouterLink class="button button-secondary" :to="`/posts/${post.id}/edit`">수정</RouterLink>
          <button class="button button-danger" type="button" @click="isDeleteModalOpen = true">
            삭제
          </button>
        </div>
      </div>
    </article>

    <section v-if="post" class="comment-section" aria-labelledby="comment-heading">
      <div class="section-heading comment-heading">
        <div>
          <p class="eyebrow">Comments</p>
          <h2 id="comment-heading">댓글 {{ totalCommentCount }}개</h2>
        </div>
      </div>

      <ul v-if="comments.length" class="comment-list">
        <li v-for="comment in comments" :key="comment.id" class="comment-card">
          <template v-if="editingCommentId !== comment.id">
            <div class="comment-meta">
              <time :datetime="comment.createdAt">{{ formatDateTime(comment.createdAt) }}</time>
              <div class="comment-actions">
                <button type="button" @click="startReplying(comment.id)">답글</button>
                <button type="button" @click="startEditingComment(comment)">수정</button>
                <button type="button" @click="openCommentDeleteModal(comment)">삭제</button>
              </div>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
            <small v-if="comment.updatedAt !== comment.createdAt" class="help-text">
              수정 {{ formatDateTime(comment.updatedAt) }}
            </small>
          </template>

          <form v-else class="comment-edit-form" @submit.prevent="submitCommentEdit(comment.id)">
            <label class="field-label" :for="`comment-edit-content-${comment.id}`">댓글 수정</label>
            <textarea
              :id="`comment-edit-content-${comment.id}`"
              v-model="editCommentForm.content"
              class="text-input comment-textarea"
              maxlength="3000"
              rows="4"
            />
            <p v-if="editCommentErrors.content" class="error-text">
              {{ editCommentErrors.content }}
            </p>
            <label class="field-label" :for="`comment-edit-password-${comment.id}`">비밀번호</label>
            <input
              :id="`comment-edit-password-${comment.id}`"
              v-model="editCommentForm.password"
              class="text-input"
              type="password"
              autocomplete="current-password"
              maxlength="20"
              placeholder="작성 시 비밀번호"
            />
            <p v-if="editCommentErrors.password" class="error-text">
              {{ editCommentErrors.password }}
            </p>
            <p v-if="commentError" class="error-text">{{ commentError }}</p>
            <div class="button-row end">
              <button class="button button-ghost" type="button" @click="cancelEditingComment">
                취소
              </button>
              <button class="button button-primary" type="submit">수정 완료</button>
            </div>
          </form>

          <div
            v-if="comment.replies?.length || replyingCommentId === comment.id"
            class="reply-section"
          >
            <ul v-if="comment.replies?.length" class="reply-list">
              <li v-for="reply in comment.replies" :key="reply.id" class="reply-card">
                <template
                  v-if="editingReplyCommentId !== comment.id || editingReplyId !== reply.id"
                >
                  <div class="comment-meta">
                    <span class="reply-label">답글</span>
                    <time :datetime="reply.createdAt">{{ formatDateTime(reply.createdAt) }}</time>
                    <div class="comment-actions">
                      <button type="button" @click="startEditingReply(comment.id, reply)">
                        수정
                      </button>
                      <button type="button" @click="openReplyDeleteModal(comment.id, reply)">
                        삭제
                      </button>
                    </div>
                  </div>
                  <p class="comment-content">{{ reply.content }}</p>
                  <small v-if="reply.updatedAt !== reply.createdAt" class="help-text">
                    수정 {{ formatDateTime(reply.updatedAt) }}
                  </small>
                </template>

                <form
                  v-else
                  class="comment-edit-form"
                  @submit.prevent="submitReplyEdit(comment.id, reply.id)"
                >
                  <label class="field-label" :for="`reply-edit-content-${reply.id}`">
                    답글 수정
                  </label>
                  <textarea
                    :id="`reply-edit-content-${reply.id}`"
                    v-model="editReplyForm.content"
                    class="text-input comment-textarea"
                    maxlength="3000"
                    rows="3"
                  />
                  <p v-if="editReplyErrors.content" class="error-text">
                    {{ editReplyErrors.content }}
                  </p>
                  <label class="field-label" :for="`reply-edit-password-${reply.id}`">
                    비밀번호
                  </label>
                  <input
                    :id="`reply-edit-password-${reply.id}`"
                    v-model="editReplyForm.password"
                    class="text-input"
                    type="password"
                    autocomplete="current-password"
                    maxlength="20"
                    placeholder="작성 시 비밀번호"
                  />
                  <p v-if="editReplyErrors.password" class="error-text">
                    {{ editReplyErrors.password }}
                  </p>
                  <p v-if="replyError" class="error-text">{{ replyError }}</p>
                  <div class="button-row end">
                    <button class="button button-ghost" type="button" @click="cancelEditingReply">
                      취소
                    </button>
                    <button class="button button-primary" type="submit">수정 완료</button>
                  </div>
                </form>
              </li>
            </ul>

            <form
              v-if="replyingCommentId === comment.id"
              class="reply-form"
              @submit.prevent="submitReply(comment.id)"
            >
              <label class="field-label" :for="`reply-content-${comment.id}`">답글 작성</label>
              <textarea
                :id="`reply-content-${comment.id}`"
                v-model="replyForm.content"
                class="text-input comment-textarea"
                maxlength="3000"
                rows="3"
                placeholder="답글을 입력해 주세요."
              />
              <p v-if="replyErrors.content" class="error-text">{{ replyErrors.content }}</p>
              <label class="field-label" :for="`reply-password-${comment.id}`">
                수정·삭제용 비밀번호
              </label>
              <input
                :id="`reply-password-${comment.id}`"
                v-model="replyForm.password"
                class="text-input"
                type="password"
                autocomplete="new-password"
                maxlength="20"
                placeholder="4~20자"
              />
              <p v-if="replyErrors.password" class="error-text">{{ replyErrors.password }}</p>
              <p v-if="replyError" class="error-text">{{ replyError }}</p>
              <div class="button-row end">
                <button class="button button-ghost" type="button" @click="cancelReplying">
                  취소
                </button>
                <button class="button button-primary" type="submit">답글 등록</button>
              </div>
            </form>
          </div>
        </li>
      </ul>
      <p v-else class="comment-empty">아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>

      <form class="comment-form" @submit.prevent="submitComment">
        <div class="form-field">
          <label class="field-label" for="comment-content">댓글 내용</label>
          <textarea
            id="comment-content"
            v-model="commentForm.content"
            class="text-input comment-textarea"
            maxlength="3000"
            rows="4"
            placeholder="댓글을 입력해 주세요."
          />
          <p v-if="commentErrors.content" class="error-text">{{ commentErrors.content }}</p>
        </div>
        <div class="comment-form-footer">
          <div>
            <label class="field-label" for="comment-password">수정·삭제용 비밀번호</label>
            <input
              id="comment-password"
              v-model="commentForm.password"
              class="text-input"
              type="password"
              autocomplete="new-password"
              maxlength="20"
              placeholder="4~20자"
            />
            <p v-if="commentErrors.password" class="error-text">{{ commentErrors.password }}</p>
          </div>
          <button class="button button-primary" type="submit">댓글 등록</button>
        </div>
        <p v-if="commentError && !editingCommentId" class="error-text">{{ commentError }}</p>
      </form>
    </section>

    <EmptyState
      v-else
      title="게시글을 찾을 수 없습니다."
      description="삭제되었거나 잘못된 주소입니다."
    >
      <RouterLink class="button button-primary" :to="{ name: ROUTE_NAMES.POSTS }">
        목록으로
      </RouterLink>
    </EmptyState>

    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="게시글 삭제"
      confirm-label="삭제"
      :error-message="deleteError"
      @close="isDeleteModalOpen = false"
      @confirm="deletePost"
    />
    <ConfirmModal
      :is-open="Boolean(commentToDelete)"
      title="댓글 삭제"
      confirm-label="삭제"
      :error-message="commentDeleteError"
      @close="closeCommentDeleteModal"
      @confirm="deleteSelectedComment"
    />
    <ConfirmModal
      :is-open="Boolean(replyToDelete)"
      title="대댓글 삭제"
      confirm-label="삭제"
      :error-message="replyDeleteError"
      @close="closeReplyDeleteModal"
      @confirm="deleteSelectedReply"
    />
  </div>
</template>
