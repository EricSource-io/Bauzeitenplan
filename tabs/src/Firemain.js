import {initialize} from "@microsoft/teams-js";
import {initializeApp} from "firebase/app";
import {
    getFirestore,
    doc,
    collection,
    onSnapshot,
    QuerySnapshot,
    addDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import {ResourceList, EventList} from "./components/Scheduler";
import {scheduler} from "./components/Tab";


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

    constructor(ref) {
        this.app = initializeApp(this.firebaseConfig);
        this.firestore = getFirestore();
        this.refScheduler = doc(this.firestore, `scheduler/${ref}`);
        this.refResources = collection(this.refScheduler, 'resource');
        this.refEvents = collection(this.refScheduler, 'event');
        this.listenToDataChanges();
    }
    listenToDataChanges() { // Scheduler
        onSnapshot(this.refScheduler, docSnapshot => {
            if (docSnapshot.exists()) {
                const docData = docSnapshot.data();
            }
        });
        // Resources
        onSnapshot(this.refResources, querySnapshot => {
            const queryData = querySnapshot.docs.map((docSnapshot, index) => {
                const uid = docSnapshot._key.path.segments[docSnapshot._key.path.segments.length - 1];
                const docData = docSnapshot.data();
                // Should the position of the resources become important, switch from index to docData.id!
                return new ResourceList.Item(uid, docData.name, docData.color)
            });
            scheduler?.config?.resources.update(queryData);
        })
        // Events
        onSnapshot(this.refEvents, querySnapshot => {
            const queryData = querySnapshot.docs.map((docSnapshot, index) => {
                const uid = docSnapshot._key.path.segments[docSnapshot._key.path.segments.length - 1];
                const docData = docSnapshot.data();
                // Date format => "YYYY-MM-DD"
                return new EventList.Item(uid, docData.resourceId, docData.start, docData.end, docData.text);
            });
            scheduler?.config?.events.update(queryData);

        })
    }
    async addANewDoc(doc, ref) {
        await addDoc(ref, doc);
    }
    async updateDoc(doc, ref) {
        await updateDoc(ref, doc)
    }

    async deleteDoc(ref) {
        await deleteDoc(ref)
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
