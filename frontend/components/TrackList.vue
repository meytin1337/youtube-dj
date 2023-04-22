<script lang="ts" setup>
import { CheckIcon, ArrowUpCircleIcon } from "@heroicons/vue/24/solid";
import { Track } from "../composables/states";
interface Props {
  tracks: Track[];
}
const deckOne = useDeckOne();
const deckTwo = useDeckTwo();
const props = defineProps<Props>();
</script>

<template>
  <div class="relative overflow-x-auto w-1/2 mr-auto ml-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th
            scope="col"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Title
          </th>
          <th
            scope="col"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Load Track on Deck 1
          </th>
          <th
            scope="col"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Load Track on Deck 2
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(track, index) in props.tracks"
          :key="track.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td class="whitespace-nowrap px-6 py-4">{{ track.title }}</td>
          <td
            v-if="deckOne.trackId.value === track.id"
            class="whitespace-nowrap px-6 py-4"
          >
            <CheckIcon class="ml-10 -8 w-8 text-green-500 cursor-pointer" />
          </td>
          <td v-else class="whitespace-nowrap px-6 py-4">
            <ArrowUpCircleIcon
              class="ml-10 -8 w-8 text-blue-400 cursor-pointer"
              @click="$emit('loadTrack', 1, track.file, track.id, track.title)"
            />
          </td>
          <td
            v-if="deckTwo.trackId.value === track.id"
            class="whitespace-nowrap px-6 py-4"
          >
            <CheckIcon class="ml-10 -8 w-8 text-green-500 cursor-pointer" />
          </td>
          <td v-else class="whitespace-nowrap px-6 py-4">
            <ArrowUpCircleIcon
              class="ml-10 kh-8 w-8 text-blue-400 cursor-pointer"
              @click="$emit('loadTrack', 2, track.file, track.id, track.title)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
