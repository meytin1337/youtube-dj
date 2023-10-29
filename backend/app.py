from flask import Flask, send_file, after_this_request
import os
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

import yt_dlp

if __name__ == "__main__":
    app.run(debug=True)


class MyLogger:
    def debug(self, msg):
        # For compatibility with youtube-dl, both debug and info are passed into debug
        # You can distinguish them by the prefix '[debug] '
        if msg.startswith("[debug] "):
            pass
        else:
            self.info(msg)

    def info(self, msg):
        pass

    def warning(self, msg):
        pass

    def error(self, msg):
        print(msg)


# ℹ️ See "progress_hooks" in help(yt_dlp.YoutubeDL)
def my_hook(d):
    if d["status"] == "finished":
        global m4a_path
        m4a_path = d["filename"]


ydl_opts = {
    "logger": MyLogger(),
    "progress_hooks": [my_hook],
    # "outtmpl": "-",  # Output to stdout instead of a file
    "format": "m4a/bestaudio/best",
    # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
    "postprocessors": [
        {  # Extract audio using ffmpeg
            "key": "FFmpegExtractAudio",
            "preferredcodec": "m4a",
        }
    ],
    "verbose": True,
}


@app.route("/download/<id>/file")
def download_file(id):
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download(["https://youtube.com/watch?v=" + id])

    @after_this_request
    def remove_file(response):
        try:
            os.remove(m4a_path)
        except Exception as error:
            app.logger.error("Error removing or closing downloaded file handle", error)
        return response

    return send_file(m4a_path, mimetype="audio/m4a", as_attachment=True)


@app.route("/download/<id>/trackinfo")
def get_track_info(id):
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        track_info = ydl.extract_info(
            "https://youtube.com/watch?v=" + id, download=False
        )
    return track_info
