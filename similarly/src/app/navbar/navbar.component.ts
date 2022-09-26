import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }
  isAuthenticated = false;
  options: NotificationOptions | undefined;

  ngOnInit(): void {
    this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authService.isUserLoggedIn$.next(false);
    this.router.navigate(['login']);
  }

  urlBase64ToUint8Array({base64String}: { base64String: any }): Uint8Array {
    let padding = '='.repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  displayConfirmationNotice() {
    if('serviceWorker' in navigator){
      this.options = {
        body: 'You successfully subscribed to our Notification service!'
      };
    }
    navigator.serviceWorker.ready
      .then( sw => {
        sw.showNotification('Successfully subscribed (from SW)!', this.options);
      });
  }

  configurePushSubscription() {
    if(!('serviceWorker' in navigator)) {
      return
    }

    let swReg: ServiceWorkerRegistration;
    navigator.serviceWorker.ready
      .then( sw => {
        swReg = sw;
        return sw.pushManager.getSubscription();
      })
      .then( sub => {
        if(sub === null) {
          // create a new subscription
          let vapidPublicKey = 'BPcTlQeQvbvz6UF6imbPHNqhZGHLV26DnrQ2hhsTnvcxNOA9fJ_O5k2CMR1pvkFaC9Ee5kQPeHe85I7SXfX3mj4';
          let convertedVapidPublicKey = this.urlBase64ToUint8Array({base64String: vapidPublicKey});
          return swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidPublicKey,
          })
        } else {
          /*sub.unsubscribe().then( () => {
            console.log('unsubscribed()', sub)
          })*/
          return
        }
      }).then( newSub => {
      return fetch('http://localhost:3000/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
        .then( response => {
          if(response.ok) {
            this.displayConfirmationNotice();
          }
        })
    })
  }

  askForNotificationPermission() {
    Notification.requestPermission( result => {
      console.log('User choice', result);
      if(result !== 'granted') {
        console.log('No notification permission granted');
      } else {
        //this.displayConfirmationNotice()
        this.configurePushSubscription();
      }
    });
  }





}
