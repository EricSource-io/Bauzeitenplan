import {initialize} from "@microsoft/teams-js";
import {initializeApp} from "firebase/app";
import {
    getFirestore,
    doc,
    collection,
    onSnapshot,
    QuerySnapshot
} from 'firebase/firestore';
import { ResourceList, EventList } from "./components/Scheduler";
export class Firemain {

    firebaseConfig = {
        apiKey: "AIzaSyAd1G7g5RlZTuPjOZxN9FqX4d2p867DywA",
        authDomain: "bauzeitplan-fe0ce.firebaseapp.com",
        databaseURL: "https://bauzeitplan-fe0ce-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "bauzeitplan-fe0ce",
        storageBucket: "bauzeitplan-fe0ce.appspot.com",
        messagingSenderId: "145900452613",
        appId: "1:145900452613:web:033e45042eaafd8d3dd56c"
    };

    constructor(ref, schedulerConfig) {
        this.schedulerConfig = schedulerConfig;
        this.app = initializeApp(this.firebaseConfig);
        this.firestore = getFirestore();
        this.refScheduler = doc(this.firestore, `scheduler/${ref}`);
        this.refResources = collection(this.refScheduler, 'resource');
        this.refEvents = collection(this.refScheduler, 'event');
        console.log("SCH")
        this.listenToDataChanges();
    }
    listenToDataChanges() {
       
        onSnapshot(this.refScheduler, docSnapshot => {
            if (docSnapshot.exists()) {
                const docData = docSnapshot.data();
                //UPDATE WHOLE RESOURCE LIST WITH UPDATE()

                console.log("SCHEDULER", JSON.stringify(docData))
            }
        });
       
    }
}


// ###################################

Firemain.Resource = {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    },
    update() {},
    delete() {}
}

Firemain.Event = {
    constructor(id, resourceId, start, end, text) {
        this.id = id;
        this.resourceId = resourceId;
        this.start = start;
        this.end = end;
        this.text = text;
    },
    update() {},
    delete() {}
}
