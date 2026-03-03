<template>
  <div class="qb-cover">
    <div class="qb-cover__accent" />
    <div class="qb-cover__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.qb-cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 3rem 4rem;
  background-color: var(--qb-navy);
  color: var(--qb-text-light);
}

.qb-cover__accent {
  width: 80px;
  height: 4px;
  background-color: var(--qb-blue);
  margin-bottom: 2rem;
}

.qb-cover__content :deep(h1) {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2.5rem;
  font-weight: 400;
  line-height: 1.2;
  color: var(--qb-text-light);
  margin-bottom: 1rem;
}

.qb-cover__content :deep(p) {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.125rem;
  color: var(--qb-text-secondary);
  max-width: 36rem;
}
</style>
