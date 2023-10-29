<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from "#ui/types";
interface TrackInfoResponse {
  title: string;
  id: string;
}

const youtubeLink = ref("https://www.youtube.com/watch?v=5IrHzrg4qdQ");
const tracks = useTracks();
const isDownloading = ref(false);
const runtimeConfig = useRuntimeConfig();
const formError = ref("");
const validate = () => {
  const regex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  if (!regex.test(youtubeLink.value)) {
    formError.value = "Invalid youtube link";
    return false;
  }
  return true;
};

const downloadTrack = async () => {
  if (!validate()) return;
  const videoId = youtubeLink.value.split("v=")[1];
  formError.value = "";
  isDownloading.value = true;
  const trackInfoResponse = await useFetch<TrackInfoResponse>(
    runtimeConfig.public.api + "download/" + videoId + "/trackinfo",
    {
      onResponseError: (_error) => {
        formError.value = "Error downloading trackinfo";
        isDownloading.value = false;
      },
    },
  );
  if (trackInfoResponse.data.value === null) return;
  if (
    tracks.value.some((track) => track.id === trackInfoResponse.data.value?.id)
  ) {
    formError.value = "Track already downloaded";
    isDownloading.value = false;
    return;
  }
  const fileResponse = await useFetch<Blob>(
    runtimeConfig.public.api + "download/" + videoId + "/file",
    {
      onResponseError: (_error) => {
        formError.value = "Error downloading file";
        isDownloading.value = false;
      },
    },
  );
  if (fileResponse.data.value === null) return;
  tracks.value.push({
    title: trackInfoResponse.data.value.title,
    file: fileResponse.data.value,
    id: trackInfoResponse.data.value.id,
  });
  isDownloading.value = false;
};
</script>

<template>
  <div class="flex flex-col w-1/2 ml-auto mr-auto">
    <UFormGroup
      v-slot="{ error }"
      label="Youtube Link"
      :error="formError"
      class="mt-5"
    >
      <UInput
        v-model="youtubeLink"
        color="blue"
        :loading="isDownloading"
        placeholder="https://www.youtube.com/watch?v=5IrHzrg4qdQ"
        :trailing-icon="
          error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined
        "
      />
    </UFormGroup>
    <UButton
      color="black"
      variant="solid"
      class="mt-5 ml-auto mr-auto"
      @click="downloadTrack"
    >
      Download
    </UButton>
  </div>
</template>
