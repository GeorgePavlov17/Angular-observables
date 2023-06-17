import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  forbiddenUsernames = ['Chriss', 'Anna'];

  constructor(private router: Router) { }

  ngOnInit() {
    this.signupFormReactive = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl('', [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl('', [Validators.required, Validators.email], this.forbiddenEmails),
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });
    // this.signupFormReactive.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );
    this.signupFormReactive.statusChanges.subscribe(
      (value) => console.log(value)
    );
    this.signupFormReactive.setValue({
      'userData': {
        'username': 'Georgi',
        'email': 'georgi@test.com'
      },
      'gender': 'male',
      'hobbies': []
    });
    this.signupFormReactive.patchValue({
      'userData': {
        'username': 'Anna'
      }
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
    this.signupFormReactive.reset();
  }

  get controls() {
    return (this.signupFormReactive.get('hobbies') as FormArray).controls;
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupFormReactive.get('hobbies')).push(control)
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if(this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  onLoadServers() {
    this.router.navigate(['/servers']);
  }

  ngOnDestroy() {
    this.countSubscription.unsubscribe();
  }

}
