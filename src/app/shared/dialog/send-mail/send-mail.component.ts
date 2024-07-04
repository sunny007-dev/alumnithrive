import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss']
})
export class SendMailComponent implements OnInit {
  form: FormGroup;
  currentUser: any;

  constructor(public dialogRef: MatDialogRef<SendMailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder, private userService: UsersService,
    private notify: TokenInterceptor) {
     }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * Build form data
   */
  buildForm() {
    this.form = this.fb.group({
      id:[this.data?.user?.id],
      subject:['', Validators.required],
      description:['', Validators.required],
    });
  }

  /**
   * Function to send mail by user id
   */
  async send() {
    await this.userService.sendUserMail(this.form.value).subscribe((x: any) => {
      if(x?.status == 200) {
        this.notify.notificationService.success(x?.message);
      } else{
        this.notify.notificationService.warning("Something went wrong! Please try again");
      }
    }, error => {
      this.notify.notificationService.error(error);
    });
  }

}
