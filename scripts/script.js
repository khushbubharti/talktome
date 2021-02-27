const AgoraRTC =  require('agora-rtc-sdk')
// import AgoraRTC from 'agora-rtc-sdk'

// Handle errors.
let handleError = function (err) {
    console.log("Error: ", err);
};

// Query the container to which the remote stream belong.
let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId) {
    // Creates a new div for every stream
    let streamDiv = document.createElement("div");
    // Assigns the elementId to the div.
    streamDiv.id = elementId;
    // Takes care of the lateral inversion
    streamDiv.style.transform = "rotateY(180deg)";
    // Adds the div to the container.
    remoteContainer.appendChild(streamDiv);
};

// Remove the video stream from the container.
function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};

let client = AgoraRTC.createClient({
    //mode determines the channel profile. Agora recommends using the rtc mode for one-to-one or group calls and the live mode for interactive live streaming.
    mode: "rtc",
    // codec sets the codec that the web browser uses for encoding and decoding. If your app needs to support Safari 12.1 or earlier, set it as h264. Otherwise, set it as vp8.
    codec: "vp8",
});

client.init("f6ad63b4306a40a58e7a33e0d19185f2");

// temp token for channel named demo 006f6ad63b4306a40a58e7a33e0d19185f2IABD/ItT6DG9ksqp+84vyBQCOetl6kDsIusxjp/qCQW/CKDfQtYAAAAAEAAEa9nrw587YAEAAQDDnztg

// Join a channel
client.join("006f6ad63b4306a40a58e7a33e0d19185f2IABD/ItT6DG9ksqp+84vyBQCOetl6kDsIusxjp/qCQW/CKDfQtYAAAAAEAAEa9nrw587YAEAAQDDnztg", "demo", null, (uid) => {
    // Create a local stream
}, handleError);


let localStream = AgoraRTC.createStream({
    audio: true,
    video: false,
});
// Initialize the local stream
localStream.init(() => {
    // Play the local stream
    localStream.play("me");
    // Publish the local stream
    client.publish(localStream, handleError);
}, handleError);


// Subscribe to the remote stream when it is published
client.on("stream-added", function (evt) {
    client.subscribe(evt.stream, handleError);
});
// Play the remote stream when it is subsribed
client.on("stream-subscribed", function (evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
});


// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function (evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function (evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});