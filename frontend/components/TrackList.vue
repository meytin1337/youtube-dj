<script lang="ts" setup>
import { Track } from "../composables/states";
interface Props {
  tracks: Track[];
}
const props = defineProps<Props>();
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
    :empty-state="{ label: 'No tracks downloaded yet' }"
  >
    <template #load-deck-one-data="{ row }">
      <UIcon
        v-if="useDeckOne().value.trackId === row.id"
        name="i-heroicons-check"
        class="ml-10 h-8 w-8 text-green-500 cursor-pointer"
      />
      <UIcon
        v-else
        name="i-heroicons-arrow-up-circle"
        class="ml-10 h-8 w-8 text-blue-400 cursor-pointer"
        @click="$emit('loadTrack', 1, row.file, row.id, row.title)"
      />
    </template>
    <template #load-deck-two-data="{ row }">
      <UIcon
        v-if="useDeckTwo().value.trackId === row.id"
        name="i-heroicons-check"
        class="ml-10 h-8 w-8 text-green-500 cursor-pointer"
      />
      <UIcon
        v-else
        name="i-heroicons-arrow-up-circle"
        class="ml-10 h-8 w-8 text-blue-400 cursor-pointer"
        @click="$emit('loadTrack', 2, row.file, row.id, row.title)"
      />
    </template>
  </UTable>
</template>
