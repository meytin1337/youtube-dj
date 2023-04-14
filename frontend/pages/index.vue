<template>
  <div class="flex flex-col items-center justify-center">
    <h1>Index page</h1>
    <p class="text-xl">Here is the index page</p>
    <div class="m-10 relative h-11 w-1/3 min-w-[200px]">
      <input
        v-model="url"
        class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        placeholder=" "
      />
      <label
        class="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
      >
        Standard
      </label>
    </div>
    <button
      class="w-1/12 kinline-block rounded bg-slate-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
      @click="downloadVideo"
    >
      send
    </button>
    {{ url }}
  </div>
</template>

<script setup>
import { Howl } from "howler";
const url = ref("");

const downloadVideo = async () => {
  const videoId = url.value.split("v=")[1];
  try {
    const { data, error } = await useFetch(
      "http://localhost:5000/download/" + videoId
    );

    if (error.value) throw error.value;
    const sound = new Howl({
      src: [URL.createObjectURL(data.value)],
      onloaderror() {
        console.log("error loading");
      },
      onplayerror() {
        console.log("error playing");
      },
      format: ["mp4"],
    });
    sound.play();
  } catch (error) {
    console.log(error);
  }
};
</script>
