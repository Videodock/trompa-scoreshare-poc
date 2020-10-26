import React from "react";

import firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAqY0uVIfSbmkQu5_JuM7SwJe2p_dfv1fw",
    authDomain: "scoresharetest.firebaseapp.com",
    databaseURL: "https://scoresharetest.firebaseio.com",
    projectId: "scoresharetest",
    storageBucket: "scoresharetest.appspot.com",
    messagingSenderId: "323468586269",
    appId: "1:323468586269:web:9f3fdcf199dcc115f445f4",
    measurementId: "G-QW7X6HYNKE"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default class FirebaseShell {
    
    db   = firebase.firestore();
    doc  = this.db.collection('scoreshare').doc('test');

    addListener    = (parentListener) => this.doc.onSnapshot(doc => parentListener(doc.data?.()));
    
    setScore       = (score)          => this.doc.set({ score: score, selectionArr: [] });
    setAudio       = (audio)          => this.doc.set({ audio:        audio });
    setSelectType  = (type)           => this.doc.set({ selectType:   type });
    setSelection   = (selection)      => this.doc.set({ selectionArr: selection });
    setAnnotations = (annotations)    => this.doc.set({ annotations:  annotations });

    setPlay        = (doPlay)         => this.doc.set({ doPlay:       doPlay });
    setProgress    = (progress)       => this.doc.set({ progress:     progress });
}