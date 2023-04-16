<script lang="ts" setup>
import { Howl } from "howler";
import LoadTrackOnDeckButton from "./LoadTrackOnDeckButton.vue";

const tracks = useTracks();
const activeTracks = useActiveTracks();
const loadTrackOnDeck = (deck: number, file: Blob, title: string) => {
  activeTracks[deck - 1].sound.value = new Howl({
    src: [URL.createObjectURL(file)],
    onloaderror() {
      throw createError("error loading");
    },
    onplayerror() {
      throw createError("error playing");
    },
    format: ["mp4"],
  });
  activeTracks[deck - 1].title.value = title;
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
                <th scope="col" class="px-6 py-4">Deck 1</th>
                <th scope="col" class="px-6 py-4">Deck 2</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(track, index) in tracks"
                :key="track.id"
                class="border-b bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700"
              >
                <td class="whitespace-nowrap px-6 py-4 font-medium">
                  {{ index }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">{{ track.title }}</td>
                <td class="whitespace-nowrap px-6 py-4">
                  <LoadTrackOnDeckButton
                    class="m-1"
                    :file="track.file"
                    button-text="load to first deck"
                    :disabled="false"
                    :title="track.title"
                    :click="loadTrackOnDeck"
                    :deck="1"
                  />
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <LoadTrackOnDeckButton
                    class="m-1"
                    :file="track.file"
                    button-text="load to second deck"
                    :disabled="false"
                    :click="loadTrackOnDeck"
                    :title="track.title"
                    :deck="2"
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
