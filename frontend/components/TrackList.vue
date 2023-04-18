<script lang="ts" setup>
import { CheckIcon, ArrowUpCircleIcon } from "@heroicons/vue/24/solid";
import { Track, Deck } from "../composables/states";
interface Props {
  tracks: Track[];
  deckOne: Deck;
  deckTwo: Deck;
}
const props = defineProps<Props>();
</script>

<template>
  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                v-if="props.deckOne.id.value === track.id"
                class="whitespace-nowrap px-6 py-4"
              >
                <CheckIcon
                  class="h-7 w-7 text-green-500 cursor-pointer ml-auto mr-auto"
                />
              </td>
              <td v-else class="whitespace-nowrap px-6 py-4">
                <ArrowUpCircleIcon
                  class="h-7 w-7 text-blue-400 cursor-pointer ml-auto mr-auto"
                  @click="
                    $emit('loadTrack', 1, track.file, track.title, track.id)
                  "
                />
              </td>
              <td
                v-if="props.deckTwo.id.value === track.id"
                class="whitespace-nowrap px-6 py-4"
              >
                <CheckIcon
                  class="h-7 w-7 text-green-500 cursor-pointer ml-auto mr-auto"
                />
              </td>
              <td v-else class="whitespace-nowrap px-6 py-4">
                <ArrowUpCircleIcon
                  class="h-7 w-7 text-blue-400 cursor-pointer ml-auto mr-auto"
                  @click="
                    $emit('loadTrack', 2, track.file, track.title, track.id)
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
