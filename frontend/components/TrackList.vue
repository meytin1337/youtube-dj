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
  <div class="overflow-x-auto mr-auto ml-auto w-1/2">
    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div class="overflow-hidden">
        <table class="min-w-full text-left text-sm font-light">
          <thead
            class="border-b bg-white font-medium dark:border-neutral-500 dark:bg-neutral-600"
          >
            <tr>
              <th scope="col" class="px-6 py-4">#</th>
              <th scope="col" class="px-6 py-4">Title</th>
              <th scope="col" class="px-6 py-4">Load Track on Deck 1</th>
              <th scope="col" class="px-6 py-4">Load Track on Deck 2</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(track, index) in props.tracks"
              :key="track.id"
              class="border-b bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-400"
            >
              <td class="whitespace-nowrap px-6 py-4 font-medium">
                {{ index + 1 }}
              </td>
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
                  @click="
                    $emit('loadTrack', 1, track.file, track.id, track.title)
                  "
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
                  @click="
                    $emit('loadTrack', 2, track.file, track.id, track.title)
                  "
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
