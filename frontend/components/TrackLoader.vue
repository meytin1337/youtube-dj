<script lang="ts" setup>
import { ArrowDownTrayIcon } from "@heroicons/vue/24/solid";

interface TrackInfoResponse {
  title: string;
  id: string;
}

const youtubeLink = useState("youtubeLink", () => "");
const tracks = useTracks();
const isValid = computed(() => youtubeLink.value !== "");
const isDownloading = ref(false);
const runtimeConfig = useRuntimeConfig();

const downloadVideo = async () => {
  const videoId = youtubeLink.value.split("v=")[1];
  isDownloading.value = true;
  const trackInfoResponse = await useFetch<TrackInfoResponse>(
    runtimeConfig.public.api + "download/" + videoId + "/trackinfo"
  );
  if (trackInfoResponse.error.value)
    throw createError({
      message: "Error downloading trackinfo",
    });
  else if (trackInfoResponse.data.value === null)
    throw createError({
      message: "Error downloading trackinfo",
    });
  else if (
    tracks.value.some((track) => track.id === trackInfoResponse.data.value.id)
  ) {
    throw createError({
      message: "Track already exists",
    });
  }
  const fileResponse = await useFetch<Blob>(
    runtimeConfig.public.api + "download/" + videoId + "/file"
  );
  if (fileResponse.error.value)
    throw createError({
      message: "Error downloading file",
    });
  if (fileResponse.data.value === null)
    throw createError({
      message: "Error downloading file",
    });

  tracks.value.push({
    title: trackInfoResponse.data.value.title,
    file: fileResponse.data.value,
    id: trackInfoResponse.data.value.id,
  });
  isDownloading.value = false;
};
</script>

<template>
  <div
    class="m-10 relative h-11 w-1/3 min-w-[200px] flex flex-col justify-center"
  >
    <div class="flex mb-10 relative h-full w-full">
      <input
        v-model="youtubeLink"
        class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        placeholder=" "
      />
      <label
        class="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
      >
        Youtube link
      </label>
      <div v-if="isDownloading">Downloading</div>
      <ArrowDownTrayIcon
        v-else-if="isValid"
        class="w-9 h-9 text-blue-500 cursor-pointer"
        disabled="isButtonDisabled"
        @click="downloadVideo"
      />
      <ArrowDownTrayIcon
        v-else
        class="w-9 h-9 text-gray-400"
        disabled="isButtonDisabled"
      />
    </div>
  </div>
</template>
