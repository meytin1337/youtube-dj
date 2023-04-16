<script lang="ts" setup>
import { Howl } from "howler";
import { CheckIcon, ArrowUpCircleIcon } from "@heroicons/vue/24/solid";

const tracks = useTracks();
const deckOne = useDeckOne();
const deckTwo = useDeckTwo();
const loadTrackOnDeck = (
  deck: number,
  file: Blob,
  title: string,
  id: string
) => {
  const activeDeck = deck === 1 ? deckOne : deckTwo;
  if (activeDeck.sound.value) activeDeck.sound.value.unload();
  activeDeck.sound.value = new Howl({
    src: [URL.createObjectURL(file)],
    onloaderror() {
      throw createError("error loading");
    },
    onplayerror() {
      throw createError("error playing");
    },
    onend() {
      activeDeck.isPlaying.value = false;
    },
    onplay() {
      activeDeck.isPlaying.value = true;
    },
    onpause() {
      activeDeck.isPlaying.value = false;
    },
    onstop() {
      activeDeck.isPlaying.value = false;
    },
    onload() {
      activeDeck.sound?.value?.rate(activeDeck.rate.value);
    },
    format: ["mp4"],
  });
  activeDeck.title.value = title;
  activeDeck.id.value = id;
};
</script>

<template>
  <div class="flex flex-col">
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
                v-for="(track, index) in tracks"
                :key="track.id"
                class="border-b bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-400"
              >
                <td class="whitespace-nowrap px-6 py-4 font-medium">
                  {{ index + 1 }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">{{ track.title }}</td>
                <td
                  v-if="deckOne.id.value === track.id"
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
                      loadTrackOnDeck(1, track.file, track.title, track.id)
                    "
                  />
                </td>
                <td
                  v-if="deckTwo.id.value === track.id"
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
                      loadTrackOnDeck(2, track.file, track.title, track.id)
                    "
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
