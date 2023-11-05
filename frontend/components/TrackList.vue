<script lang="ts" setup>
const tracks = useTracks();
defineEmits(["loadTrack"]);
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "title",
    label: "Title",
  },
  {
    key: "load-deck-one",
    label: "Load on left deck",
  },
  {
    key: "load-deck-two",
    label: "Load on right deck",
  },
];
</script>

<template>
  <UTable
    :rows="tracks"
    :columns="columns"
    :empty-state="{
      label: 'No tracks downloaded yet',
      icon: 'i-heroicons-music-note',
    }"
  >
    <template #load-deck-one-data="{ row }">
      <UIcon
        v-if="useDeckValues(0).value.trackId === row.id"
        name="i-heroicons-check"
        class="ml-10 h-8 w-8 text-green-500 cursor-pointer"
      />
      <UIcon
        v-else
        name="i-heroicons-arrow-up-circle"
        class="ml-10 h-8 w-8 text-blue-400 cursor-pointer"
        @click="$emit('loadTrack', 0, row.id)"
      />
    </template>
    <template #load-deck-two-data="{ row }">
      <UIcon
        v-if="useDeckValues(1).value.trackId === row.id"
        name="i-heroicons-check"
        class="ml-10 h-8 w-8 text-green-500 cursor-pointer"
      />
      <UIcon
        v-else
        name="i-heroicons-arrow-up-circle"
        class="ml-10 h-8 w-8 text-blue-400 cursor-pointer"
        @click="$emit('loadTrack', 1, row.id)"
      />
    </template>
  </UTable>
</template>
