import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private countSubscription: Subscription;
  // TD Forms
  @ViewChild('f') signupForm: NgForm;
  defaultQuestion = 'pet';
  answer = '';
  genders = ['male', 'female'];
  user = {
    username: '',
    email: '',
    secretQuestion: '',
    answer: '',
    gender: ''
  };
  submitted = false;

  // Reactive Forms
  gendersReactive = ['male', 'female'];
  signupFormReactive: FormGroup;

  constructor() { }

  ngOnInit() {
    this.signupFormReactive = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl('default username', Validators.required),
        'email': new FormControl('default email', [Validators.required, Validators.email]),
      }),
      'gender': new FormControl('male')
    });

    // this.countSubscription = interval(1000).subscribe(count => {
    //   console.log(count);
    // });
    const customIntervalObservable = new Observable(observer => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        if(count === 5) {
          observer.complete();
        }
        if(count > 3) {
          // observer.error(new Error('count is greater than 3'));
        }
        count++;
      }, 1000);
    });

  
    this.countSubscription = customIntervalObservable.pipe(filter((data: number) => {
      return data > 0;
    }), map((data: number) => {
      return 'Round: ' + (data + 1);
    })).subscribe(data => {
      // console.log(data);
    }, error => {
      console.log(error);
      alert(error.message);
    }, () => {
      console.log('Completed!')
    });
  }

  suggestUserName() {
    const suggestedName = 'Superuser';

    //override every form set into the setValue
    // this.signupForm.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email: ''
    //   },
    //   secret: 'pet',
    //   questionAnswer: '',
    //   gender: 'male'
    // });

    //override a single value 
    this.signupForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }

  // onSubmit(form: NgForm) {
  //   console.log(form)
  // }

  onSubmit() {
    this.submitted = true;
    // this.user.username = this.signupForm.value.username;
    // this.user.email = this.signupForm.value.email;
    this.user.secretQuestion = this.signupForm.value.secret;
    this.user.answer = this.signupForm.value.questionAnswer;
    this.user.gender = this.signupForm.value.gender;

    this.signupForm.reset();
  }

  onSubmitReactive() {
    console.log(this.signupFormReactive);
  }

  ngOnDestroy() {
    this.countSubscription.unsubscribe();
  }

}
