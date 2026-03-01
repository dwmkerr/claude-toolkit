<template>
  <div class="qb-default">
    <slot />
  </div>
</template>

<style scoped>
.qb-default {
  height: 100%;
  padding: 2.5rem 3rem;
  background-color: var(--qb-white);
  color: var(--qb-text-dark);
}

.qb-default :deep(h1) {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2rem;
  font-weight: 400;
  color: var(--qb-navy);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid var(--qb-blue);
}

.qb-default :deep(h2) {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--qb-navy);
  margin-bottom: 1rem;
}

.qb-default :deep(h3) {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--qb-grey-500);
}

.qb-default :deep(ul),
.qb-default :deep(ol) {
  margin-left: 1.5rem;
}

.qb-default :deep(li) {
  margin-bottom: 0.5rem;
}

.qb-default :deep(a) {
  color: var(--qb-blue);
  text-decoration: underline;
}

.qb-default :deep(code) {
  background-color: #F5F5F5;
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.875em;
}
</style>
