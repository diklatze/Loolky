 <ion-item>
        <ion-label>Name</ion-label>
        <ion-input [(ngModel)]="myUser.name" type="text"></ion-input>
    </ion-item>

    <ion-item>
        <ion-label>Family name</ion-label>
        <ion-input [(ngModel)]="myUser.nameFamily"> type="text"></ion-input>

    </ion-item>


    <ion-item>
        <ion-label>Age</ion-label>
        <ion-input [(ngModel)]="myUser.age" type="number" min="0" max="120"></ion-input>
    </ion-item>

       <!-- <button ion-button value="Refresh Page" (click)="postPerson()">Submit</button> -->