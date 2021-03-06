import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})


export class DocumentsComponent {

  //Lets initiate Record OBJ
   public record;
   //Will use this flag for detect recording
   public recording = false;
   //Url of Blob
   public url;
   public error;
   constructor(private domSanitizer: DomSanitizer) {
   }
   sanitize(url:string){
       return this.domSanitizer.bypassSecurityTrustUrl(url);
   }
   /**
    * Start recording.
    */
   initiateRecording() {

       this.recording = true;
       let mediaConstraints = {
           video: false,
           audio: true
       };
       navigator.mediaDevices
           .getUserMedia(mediaConstraints)
           .then(this.successCallback.bind(this), this.errorCallback.bind(this));
   }
   /**
    * Will be called automatically.
    */
   successCallback(stream) {
       var options = {
           mimeType: "audio/wav",
           numberOfAudioChannels: 1
       };
       //Start Actuall Recording
       var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
       this.record = new StereoAudioRecorder(stream, options);
       this.record.record();
   }
   /**
    * Stop recording.
    */
   stopRecording() {
       this.recording = false;
       this.record.stop(this.processRecording.bind(this));
   }
   /**
    * processRecording Do what ever you want with blob
    * @param  {any} blob Blog
    */
   processRecording(blob) {
       this.url = URL.createObjectURL(blob);
   }
   /**
    * Process Error.
    */
   errorCallback(error) {
       this.error = 'Can not play audio in your browser';
   }
}

