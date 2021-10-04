import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInterface, UserModel} from "../../../Models/User.model";
import {AlertSnackBar} from "../../Util/shared";

@Component({
  selector: 'app-setting-account',
  templateUrl: './setting-account.component.html',
  styleUrls: ['./setting-account.component.css']
})
export class SettingAccountComponent implements OnInit {
  loading = false;
  thisUser: UserInterface = UserModel.toUserInterface(UserModel.getCurrentUser());
  coverImageUrl = '';
  coverImageFile: any;
  profileImgFormGroup!: FormGroup;
  profileUpdated = false;
  constructor(private titleService: Title, private router: Router, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.titleService.setTitle('Account Settings');
  }
  async ngOnInit() {

    this.profileImgFormGroup = this.fb.group({
      name: '',
      coverImage: [],
      description: '',
    });
    const fileReader = new FileReader();
    fileReader.onload = e => {
      // The file's text will be printed here
      this.profileUpdated = true;
      this.coverImageUrl = fileReader.result ? fileReader.result as string : '';
    };
    this.profileImgFormGroup.controls.coverImage.valueChanges.subscribe((coverImage: any) => {
      if (!Array.isArray(coverImage) && this.profileImgFormGroup.controls.coverImage.value) {
        this.coverImageFile = this.profileImgFormGroup.controls.coverImage.value.files[0];
        fileReader.readAsDataURL(this.profileImgFormGroup.controls.coverImage.value.files[0]);
      } else {
        this.coverImageFile = undefined;
        this.coverImageUrl = '';
      }
    });
    if ((await UserModel.getCurrentUser().fetch()).get('profileImg')) {
      this.coverImageUrl = UserModel.getCurrentUser().get('profileImg')._url;
    }
  }

  updateProfile(){
    UserModel.saveUser(this.thisUser, this.coverImageFile, this.profileUpdated).then(value => {
      if(value instanceof UserModel) {
        AlertSnackBar(this.snackBar, true, "Profile Updated!")
        this.thisUser = UserModel.toUserInterface(UserModel.getCurrentUser());
      }else{
        AlertSnackBar(this.snackBar, false, "Error Updating Profile")
        this.thisUser = UserModel.toUserInterface(UserModel.getCurrentUser());
      }
      setTimeout(() => {
        window.location.reload();
      }, 500);
      }, reason => AlertSnackBar(this.snackBar, false, reason.message)
    ).catch(reason => AlertSnackBar(this.snackBar, false, reason.message));
  }
}
