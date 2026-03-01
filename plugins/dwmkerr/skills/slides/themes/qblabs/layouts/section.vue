<template>
  <div class="qb-section">
    <div class="qb-section__accent" />
    <div class="qb-section__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.qb-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 3rem 4rem;
  background-color: var(--qb-navy);
  color: var(--qb-text-light);
}

.qb-section__accent {
  width: 60px;
  height: 4px;
  background-color: var(--qb-blue);
  margin-bottom: 1.5rem;
}

.qb-section__content :deep(h1) {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2.25rem;
  font-weight: 400;
  color: var(--qb-text-light);
}

.qb-section__content :deep(p) {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  color: var(--qb-text-secondary);
  max-width: 32rem;
}
</style>
